// Pull off some properties from the Matter library

const { Engine, Render, Runner, World, Bodies } = Matter

const cells = 3
const width = 600
const height = 600

const engine = Engine.create()
const { world } = engine
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
})
Render.run(render)
Runner.run(Runner.create(), engine)

// Walls - originx, originy, width, height, options
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
]

World.add(world, walls)

// Maze Generation

// Function to randomize elements in the neighbours array
const shuffle = (arr) => {
  let counter = arr.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)

    counter--

    const temp = arr[counter]
    arr[counter] = arr[index]
    arr[index] = temp
  }
  return arr
}

// Create an array with a number(cells) of possible places in it. Fill will null in each element
// Then map over the array and replace each 'null' with an array containing
// 3 elements with the value false
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false))

// Create an array for the number of vertical walls in the maze grid
const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false))

// Create an array for the number of horizontal walls in the maze grid
const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false))

// Create 2 random numbers between 0 - 2
const startRow = Math.floor(Math.random() * cells)
const startColumn = Math.floor(Math.random() * cells)

const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row, column], then return
  if (grid[row][column]) {
    return
  }
  // Mark this cell as being visited
  grid[row][column] = true
  // Assemble randomly ordered list of neighbours
  const neighbours = shuffle([
    [row - 1, column],
    [row, column + 1],
    [row + 1, column],
    [row, column - 1],
  ])
  // For each neighbour ......

  // See if that neighbour is out of bounds

  // Check If we have visited that neighbour, continue to next neighbour

  // Remove a wall from either horizontals or verticals

  // Visit that next cell
}

stepThroughCell(1, 1)
