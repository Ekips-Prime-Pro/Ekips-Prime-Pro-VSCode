# Copilot instructions – Ekips Prime Pro robot project

This project is written in **Ekips Prime Pro** (`.ekips` files), a small
robot language for the LEGO® SPIKE™ Prime hub. The people working here are
**students (grades 7–10)**. Full reference:
<https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core/blob/main/docs/language.md>

## How to help

- Explain in simple words and short sentences. Answer in the language the
  student writes in (e.g. German).
- Prefer small, readable code over clever code. Use clear names
  (`leftWheel`, `driveToLine`).
- Write code comments in **English**.
- Only use the syntax and API below. **Do not invent** methods, classes or
  units. If something is not possible, say so.

## The language in one minute

Ekips Prime Pro is **TypeScript without type annotations**, plus **units on
numbers**.

- Every program needs **`async function main()`**. It is where the program starts.
- Code outside of functions runs once before `main` – use it for setup.
- Comments: `// …` and `/* … */`. Semicolons are optional at line ends.
- **No types:** never write `: number`, `: void`, `interface`, `type`, `enum`, generics.
- **Not available:** `class`, object literals `{ a: 1 }`, `import`/`export`,
  template strings `` `…` ``, `var`, `switch`, `try`/`catch`.
- Use `const` and `let`. `==` and `===` both compare strictly.

### Units – written directly after the number, no space

| Kind | Units | Example |
|---|---|---|
| Length | `mm`, `cm` | `20cm`, `150mm` |
| Angle | `deg` (or `°`), `rot` | `90deg`, `90°`, `1.5rot` |
| Time | `s`, `ms` | `2s`, `300ms` |
| Speed / power | `%` | `50%` |

There are no other units (no `m`, `km`, `min`). Write 1 m as `100cm`.
Values keep their unit: `20cm + 5mm`, `2 * 90deg`. Do not mix kinds
(`20cm + 3s` is an error). `10 % 3` (with spaces) is the remainder operator.

### Setup

```ts
const leftWheel = new Motor(Port.A);
const rightWheel = new Motor(Port.B);
const robot = new DriveBase(leftWheel, rightWheel, 56mm, 112mm); // wheel diameter, axle track
const arm = new Motor(Port.C);
const eye = new ColorSensor(Port.D);
const sonar = new DistanceSensor(Port.E);
const bumper = new ForceSensor(Port.F);
```

Ports are `Port.A` … `Port.F`. The gyro is built into the hub (`hub.heading`).

### API

| Object | Members |
|---|---|
| `DriveBase` | `drive(distance, speed?)` ⏳, `turn(angle, speed?)` ⏳ (positive = right), `run(speed)`, `stop()` |
| `Motor` | `rotate(angle, speed?)` ⏳, `run(speed)`, `stop()`, `angle`, `speed`, `resetAngle()` |
| `ColorSensor` | `color`, `sees(color)`, `reflection` (in `%`) |
| `DistanceSensor` | `distance` (length; `200cm` if nothing in range) |
| `ForceSensor` | `pressed`, `force` (newtons) |
| `hub` | `show(value)`, `beep(frequency?, duration?)` ⏳, `heading`, `resetHeading()`, `timer`, `resetTimer()`, `battery` |
| Global | `wait(time)` ⏳, `waitUntil(() => condition)` ⏳, `Promise.all([...])` ⏳, `Promise.race([...])` ⏳, `console.log(...)` |
| `Math` | `abs`, `min`, `max`, `round`, `floor`, `ceil`, `sqrt`, `random`, `PI` |

Colors: `Color.None`, `Color.Black`, `Color.Violet`, `Color.Blue`,
`Color.Azure`, `Color.Green`, `Color.Yellow`, `Color.Red`, `Color.White`.

⏳ = returns a **Promise**: the movement starts immediately and **`await`**
waits until it is finished. **Always `await` movements** unless they should
run at the same time as something else (then store the Promise and await
it later, or use `Promise.all`). `await` only works inside `async` functions,
so functions that move the robot must be `async function`.

### Patterns

```ts
// Drive a square
async function square(side) {
  for (let i = 0; i < 4; i++) {
    await robot.drive(side);
    await robot.turn(90deg);
  }
}

// Two things at the same time, continue when both are done
await Promise.all([robot.drive(80cm), arm.rotate(180deg)]);

// Drive until a black line, but at most 1 m
await Promise.race([
  robot.drive(100cm, 40%),
  waitUntil(() => eye.sees(Color.Black)),
]);
robot.stop();

// Several missions after each other
const missions = [mission1, mission2];
async function main() {
  for (const mission of missions) {
    await mission();
  }
}
```

### Common mistakes to avoid

- Forgetting `await` before `robot.drive(...)`, `robot.turn(...)`,
  `arm.rotate(...)`, `wait(...)`, `waitUntil(...)`.
- Using `await` in a function that is not `async`.
- Numbers without units for distances, angles or times (`robot.drive(20)`
  → `robot.drive(20cm)`).
- A space between number and unit (`20 cm` → `20cm`).
- TypeScript types, `var`, classes, object literals or `import`.
- Missing `async function main()`.
- After `Promise.race` with a `run`/`drive`, call `robot.stop()`.
