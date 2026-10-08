const players = require('../data/players.json');
const mal = players.filter(p => p.teamId === 'malaysia');

console.log('=== FIFA ASEAN CUP 2026 PLAYERS ===');
const fifa = mal.filter(p => p.tournamentId === 'fifa-asean-cup-2026');
fifa.sort((a,b) => (b.minutes || 0) - (a.minutes || 0));
fifa.forEach(p => console.log(`${p.id}: ${p.name} (${p.position}) | apps: ${p.appearances}, mins: ${p.minutes}, G: ${p.goals}, A: ${p.assists}, passAcc: ${p.passingAccuracy}%, rating: ${p.averageRating}`));

console.log('\n=== AFF CUP 2026 PLAYERS ===');
const aff = mal.filter(p => p.tournamentId === 'aff-cup-2026');
aff.sort((a,b) => (b.minutes || 0) - (a.minutes || 0));
aff.forEach(p => console.log(`${p.id}: ${p.name} (${p.position}) | apps: ${p.appearances}, mins: ${p.minutes}, G: ${p.goals}, A: ${p.assists}, passAcc: ${p.passingAccuracy}%, rating: ${p.averageRating}`));
