export function generateRandomDraw() {
    const numbers = []
    while (numbers.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1
      if (!numbers.includes(n)) numbers.push(n)
    }
    return numbers.sort((a, b) => a - b)
  }
  
  export function generateWeightedDraw(allScores) {
    const frequency = {}
    allScores.forEach(s => {
      frequency[s.score] = (frequency[s.score] || 0) + 1
    })
  
    const pool = []
    Object.entries(frequency).forEach(([score, count]) => {
      for (let i = 0; i < count; i++) pool.push(parseInt(score))
    })
  
    while (pool.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1
      if (!pool.includes(n)) pool.push(n)
    }
  
    const numbers = []
    const shuffled = pool.sort(() => Math.random() - 0.5)
    for (const n of shuffled) {
      if (!numbers.includes(n) && numbers.length < 5) numbers.push(n)
    }
  
    return numbers.sort((a, b) => a - b)
  }
  
  export function checkMatch(userScores, drawNumbers) {
    const scoreValues = userScores.map(s => s.score)
    const matches = drawNumbers.filter(n => scoreValues.includes(n))
    return matches.length
  }
  
  export function calculatePrizePools(subscriberCount) {
    const monthlyRevenue = subscriberCount * 9.99
    const prizePool = monthlyRevenue * 0.5 
    return {
      jackpot: parseFloat((prizePool * 0.40).toFixed(2)),
      fourMatch: parseFloat((prizePool * 0.35).toFixed(2)),
      threeMatch: parseFloat((prizePool * 0.25).toFixed(2)),
      total: parseFloat(prizePool.toFixed(2)),
    }
  }
  
  export function getPrizeTier(matchCount) {
    if (matchCount === 5) return '5-Number Match'
    if (matchCount === 4) return '4-Number Match'
    if (matchCount === 3) return '3-Number Match'
    return null
  }