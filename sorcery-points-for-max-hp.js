console.debug('Sorcery Points conversion script loaded');
const actor = args[0].actor;
const roll = new Roll('1d6');
const evaluation = await roll.evaluate({async: true});


const newCurrentSorceryPoints = (actor, rollValue) => {
    const {
        value: currentSorceryPoints,
        max: maxSorceryPoints
    } = actor.data.resources.primary;
    if (maxSorceryPoints >= currentSorceryPoints + rollValue) return currentSorceryPoints + rollValue;
    return maxSorceryPoints;
}

const newSorceryForBloodPoints = (actor, rollValue) => {
    const previousBloodPoints=actor.flags.saylonEffects?.sorceryForBloodPoints || 0;
    return previousBloodPoints + rollValue;
}
console.log('before update')
console.log(`${actor.name} has ${actor.data.resources.primary.value} sorcery points and ${actor.flags.saylonEffects?.sorceryForBloodPoints || 0} sorcery for blood points`);
console.log(`${actor.name} has ${actor.data.attributes.hp.value} HP and ${actor.data.attributes.hp.max} max HP}`);

await actor.update({
    'data.attributes.hp.tempmax': actor.data.attributes.hp.tempmax - evaluation.total,
    'data.attributes.hp.value': actor.data.attributes.hp.value - evaluation.total,
    'data.resources.primary.value': newCurrentSorceryPoints(actor, evaluation.total),
    flags: {
        saylonEffects: {
            sorceryForBloodPoints: newSorceryForBloodPoints(actor,evaluation.total),
        },
    },
});

console.log('after update')
console.log(`${actor.name} has ${actor.data.resources.primary.value} sorcery points and ${actor.flags.saylonEffects?.sorceryForBloodPoints || 0} sorcery for blood points`);
console.log(`${actor.name} has ${actor.data.attributes.hp.value} HP and ${actor.data.attributes.hp.max} max HP}`);