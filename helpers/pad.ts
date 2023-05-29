const pad = (num: number = 0, size: number = 3) => {
  let padded = num?.toString() || '0'
  while (padded.length < size) padded = '0' + padded
  return padded
}

export default pad
