---
title: "Tinkercad Circuits: Simulating Arduino and Electronics Projects in Browser"
excerpt: "How to use Tinkercad Circuits to design and simulate Arduino projects without hardware — covering component placement, wiring, code editing, and simulation debugging."
category: "workflow"
softwareSlug: "tinkercad"
keyword: "tinkercad circuits arduino simulation electronics"
slug: "tinkercad-circuits-arduino-simulation-electronics"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.tinkercad.com/learn/circuits"
  - "https://www.tinkercad.com/blog/circuits"
---

# Tinkercad Circuits: Simulating Arduino and Electronics Projects in Browser

Tinkercad Circuits is a hidden gem. Most people know Tinkercad for 3D modeling, but the Circuits module is a full Arduino simulator. I use it to prototype projects before buying parts. Here's how to use it.

## Getting Started

1. Go to **tinkercad.com** → sign in.
2. Click **Circuits** (left sidebar) → **Create New Circuit**.
3. The circuits workspace opens with:
   - **Components panel** (right): Arduino, breadboard, LEDs, resistors, sensors, motors
   - **Canvas** (center): Where you place and wire components
   - **Code editor** (top): Block-based or text-based Arduino code
   - **Simulation controls** (top): Start, stop, reset

## Project 1: Blink an LED

### Step 1: Place Components

1. Search **Arduino** in the components panel → drag an Arduino Uno R3 to the canvas.
2. Search **Breadboard** → drag a mini breadboard next to the Arduino.
3. Search **LED** → drag a red LED to the breadboard.
4. Search **Resistor** → drag a 220Ω resistor to the breadboard.

### Step 2: Wire the Circuit

1. Connect Arduino **GND** to the breadboard **negative rail** (blue line).
2. Connect Arduino **Pin 13** to the breadboard **positive rail** (red line) — or directly to the LED.
3. Connect the LED **anode** (longer leg) to Pin 13 via the breadboard.
4. Connect the LED **cathode** (shorter leg) to one end of the 220Ω resistor.
5. Connect the other end of the resistor to **GND** (negative rail).

### Step 3: Write the Code

1. Click **Code** (top of the screen).
2. The code editor opens with block-based programming (like Scratch).
3. Switch to text mode: click the dropdown → select **Text**.
4. The default Arduino code appears:

```cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

5. This blinks the LED on Pin 13 every 1 second.

### Step 4: Simulate

1. Click **Start Simulation** (top right).
2. The LED blinks on and off every second.
3. The simulation shows:
   - LED state (on/off)
   - Pin 13 voltage (5V/0V)
   - Current flow through the circuit

4. Click **Stop Simulation** to pause.
5. Modify the delay values and re-run to see different blink rates.

## Project 2: Potentiometer-Controlled Servo

### Step 1: Place Components

1. Arduino Uno R3
2. Breadboard (full size)
3. Potentiometer (10kΩ)
4. Servo motor (SG90)
5. Jumper wires

### Step 2: Wire the Circuit

1. **Potentiometer**:
   - Left pin → GND
   - Middle pin → Arduino A0
   - Right pin → 5V

2. **Servo**:
   - Red wire → 5V
   - Brown/black wire → GND
   - Orange/yellow wire → Arduino Pin 9

### Step 3: Write the Code

```cpp
#include <Servo.h>

Servo myServo;
int potPin = A0;
int val;

void setup() {
  myServo.attach(9);
}

void loop() {
  val = analogRead(potPin);
  val = map(val, 0, 1023, 0, 180);
  myServo.write(val);
  delay(15);
}
```

### Step 4: Simulate

1. Click **Start Simulation**.
2. Drag the potentiometer knob in the simulation.
3. The servo rotates to match the potentiometer position.
4. The simulation shows the analog read value and servo angle in real-time.

## Available Components

Tinkercad Circuits includes a wide range of components:

### Basic Electronics
- Resistors, capacitors, inductors
- LEDs (various colors), RGB LEDs
- Diodes, transistors (NPN, PNP)
- Switches, buttons, relays
- Buzzers, speakers

### Sensors
- Potentiometer, photoresistor (LDR)
- Temperature sensor (TMP36)
- Ultrasonic distance sensor (HC-SR04)
- PIR motion sensor
- Gas sensor (MQ-2)

### Displays
- 16×2 LCD display
- 7-segment display
- LED matrix (8×8)
- OLED display (via I2C)

### Actuators
- Servo motor (SG90)
- DC motor
- Stepper motor
- Solenoid

### Microcontrollers
- Arduino Uno R3
- Arduino Mega
- Arduino Nano
- Micro:bit

## Debugging in Simulation

### Serial Monitor

1. In the code editor: add `Serial.begin(9600)` in setup().
2. Add `Serial.println(value)` to print values.
3. During simulation: click **Serial Monitor** at the bottom of the screen.
4. The serial monitor shows printed values in real-time.

### Oscilloscope

1. Click the oscilloscope icon on any wire.
2. The oscilloscope displays the voltage waveform on that wire.
3. Useful for checking PWM signals, sensor outputs, and communication protocols.

### Multimeter

1. Search **Multimeter** in the components panel.
2. Place it in the circuit (connect probes to the points you want to measure).
3. During simulation, the multimeter shows:
   - Voltage (V)
   - Current (mA)
   - Resistance (Ω)

## Exporting to Real Hardware

After simulating successfully:

1. **Export the code**: Copy the Arduino code from the text editor.
2. **Paste into Arduino IDE**: Open the Arduino IDE on your computer, paste the code.
3. **Wire the real circuit**: Follow the same wiring as in the simulation.
4. **Upload to Arduino**: Connect the Arduino via USB and upload the code.

The simulation ensures your code and wiring are correct before you buy or assemble the physical circuit.

## Limitations of Tinkercad Circuits

- **No custom libraries**: You can't install Arduino libraries that aren't built-in.
- **No custom PCB design**: Tinkercad Circuits doesn't design PCBs — use Eagle or KiCad for that.
- **Limited component models**: Some advanced sensors and ICs aren't available.
- **No analog simulation**: The simulation is digital — it doesn't model analog circuit behavior precisely.
- **No RF or high-frequency**: The simulation is for low-frequency digital and basic analog circuits.

## Tips for Better Simulations

1. **Always add resistors for LEDs**: Without a current-limiting resistor, the LED would burn out in real life. The simulation may not show this, but real hardware will.

2. **Use the serial monitor for debugging**: Print sensor values and variable states to understand what your code is doing.

3. **Test edge cases**: Turn potentiometers to extremes, press buttons rapidly, and check that your code handles all cases.

4. **Document your wiring**: Take screenshots of the circuit before closing. Tinkercad saves your project, but screenshots help when building the real circuit.
