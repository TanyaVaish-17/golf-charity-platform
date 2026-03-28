import { createClient } from '@supabase/supabase-js'
import { generateRandomDraw, generateWeightedDraw, checkMatch, calculatePrizePools, getPrizeTier } from '@/lib/drawEngine'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { action, drawId, drawType } = await req.json()

    if (action === 'simulate' || action === 'create') {
      const { data: subscribers } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_status', 'active')

      const subscriberCount = subscribers?.length || 0

      const { data: allScores } = await supabase
        .from('scores')
        .select('score, user_id')

      const drawNumbers = drawType === 'weighted'
        ? generateWeightedDraw(allScores || [])
        : generateRandomDraw()

      const pools = calculatePrizePools(subscriberCount)

      if (action === 'simulate') {
        return Response.json({ drawNumbers, pools, subscriberCount })
      }

      const { data: draw, error } = await supabase
        .from('draws')
        .insert({
          draw_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          draw_numbers: drawNumbers,
          draw_type: drawType || 'random',
          jackpot_amount: pools.jackpot,
          pool_4match: pools.fourMatch,
          pool_3match: pools.threeMatch,
          total_subscribers: subscriberCount,
        })
        .select()
        .single()

      if (error) return Response.json({ error: error.message }, { status: 500 })

      for (const sub of (subscribers || [])) {
        const { data: userScores } = await supabase
          .from('scores')
          .select('score')
          .eq('user_id', sub.id)

        const matchCount = checkMatch(userScores || [], drawNumbers)
        const prizeTier = getPrizeTier(matchCount)

        await supabase.from('draw_entries').insert({
          draw_id: draw.id,
          user_id: sub.id,
          numbers: userScores?.map(s => s.score) || [],
          match_count: matchCount,
          prize_tier: prizeTier,
        })
      }

      return Response.json({ success: true, draw })
    }

    if (action === 'publish') {
      const { data: draw } = await supabase
        .from('draws')
        .select('*')
        .eq('id', drawId)
        .single()

      const { data: entries } = await supabase
        .from('draw_entries')
        .select('*')
        .eq('draw_id', drawId)
        .not('prize_tier', 'is', null)

      const fiveMatch = entries?.filter(e => e.match_count === 5) || []
      const fourMatch = entries?.filter(e => e.match_count === 4) || []
      const threeMatch = entries?.filter(e => e.match_count === 3) || []

      let jackpotAmount = draw.jackpot_amount
      if (fiveMatch.length === 0) {
        jackpotAmount = 0 
      }

      const insertWinners = async (group, poolAmount, matchType) => {
        if (group.length === 0) return
        const share = parseFloat((poolAmount / group.length).toFixed(2))
        for (const entry of group) {
          await supabase.from('winners').insert({
            draw_id: drawId,
            user_id: entry.user_id,
            match_type: matchType,
            prize_amount: share,
            verification_status: 'pending',
            payment_status: 'pending',
          })
        }
      }

      await insertWinners(fiveMatch, draw.jackpot_amount, '5-Number Match')
      await insertWinners(fourMatch, draw.pool_4match, '4-Number Match')
      await insertWinners(threeMatch, draw.pool_3match, '3-Number Match')

      await supabase.from('draws').update({
        status: 'published',
        published_at: new Date().toISOString(),
      }).eq('id', drawId)

      return Response.json({ success: true, winners: { fiveMatch: fiveMatch.length, fourMatch: fourMatch.length, threeMatch: threeMatch.length } })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}