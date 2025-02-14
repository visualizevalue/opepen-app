export const optInMessage = ({}) => {
  return `I want to submit ${selected.value.length} Opepen for possible artwork reveal in the following set:

SET NAME: ${props.data.name}

MAX REVEALS:
${Object.keys(maxRevealValues.value)
  .filter(g => maxRevealValues.value[g])
  .map(g => [g, maxRevealValues.value[g]])
  .map(([g, max]) => `- Edition of ${g}: ${max} Reveal${max > 1 ? 's' : ''}`)
  .join('\n')
}

OPEPEN PROOF: ${ proof(selected.value.map(id => `#${id}`).join(', '))) }`
}
