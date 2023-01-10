// Destructure some properties from the Matter library

const { Engine, Render, Runner, World, Bodies, Body } = Matter

const cells = 15
const width = 600
const height = 600

const unitLength = width / cells

const engine = Engine.create()
engine.world.gravity.y = 0.1
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

// Create the boundary walls
// Walls - originx, originy, width, height, options
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
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
  // Assemble randomly ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left'],
  ])
  // For each neighbor ......
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor
    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue
    }
    // Check If we have visited that neighbour, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue
    }
    // Remove a wall from either horizontals or verticals
    if (direction === 'left') {
      verticals[row][column - 1] = true
    } else if (direction === 'right') {
      verticals[row][column] = true
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true
    } else if (direction === 'down') {
      horizontals[row][column] = true
    }

    stepThroughCell(nextRow, nextColumn)
  }
  // Visit that next cell
}
stepThroughCell(startRow, startColumn)

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      {
        isStatic: true,
      }
    )

    World.add(world, wall)
  })
})

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return
    }

    const vWall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength,
      {
        isStatic: true,
      }
    )
    World.add(world, vWall)
  })
})

// Create the goal
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    isStatic: true,
  }
)
World.add(world, goal)

// Create the ball
const ball = Bodies.circle(
  unitLength / 2,
  unitLength / 2,
  unitLength / 4
)
World.add(world, ball)

document.addEventListener('keydown', (event) => {
  const { x, y } = ball.velocity
  const speedLimit = 5

  if (event.code === 'KeyW') {
    Body.setVelocity(ball, { x, y: Math.max(y - 5, -speedLimit) })
  }

  if (event.code === 'KeyD') {
    Body.setVelocity(ball, { x: Math.min(x + 5, speedLimit), y })
  }

  if (event.code === 'KeyS') {
    Body.setVelocity(ball, { x, y: Math.min(y + 5, speedLimit) })
  }

  if (event.code === 'KeyA') {
    Body.setVelocity(ball, { x: Math.max(x - 5, -speedLimit), y })
  }
})
