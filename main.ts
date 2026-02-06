
let address = 0x30

enum Motorlist {
    //% block="A"
    M1 = 1,
    //% block="B"
    M2 = 2
}

enum Direction1 {
    //% block="Forward"
    Forward = 0,
    //% block="Backward"
    Backward = 1
}
enum LED_rgb_L_R {
    //% bolck="LED_R"
    LED_R = 1,
    //% bolck="LED_L"
    LED_L = 0,
}

enum LED_color {
    //% block="red"
    red1 = 1,
    //% block="green"
    green1 = 2,
    //% block="blue"
    blue1 = 3,
    //% block="cyan"
    cyan = 4,
    //% block="purple"
    purple = 5,
    //% block="white"
    white = 6,
    //% block="yellow"
    yellow = 7,
    //% block="Turn off LED"
    black = 8,

}
enum pwm_led_l {
    //% black="red"
    pwm_red_r = 0x08,
    //% black="green"
    pwm_green_r = 0x07,
    //% black="blue"
    pwm_blue_r = 0x06,
}

enum pwm_led_r {
    //% black="red"
    pem_red_l = 0x09,
    //% black="green"
    pwm_green_l = 0x0a,
    //% black="blue"
    pwm_blue_l = 0x05,
}

//% color="#AA278D"
namespace MiniCar {
    const DRIVE_SPEED = 180
    const ROTATE_SPEED = 140
    const ROTATE_90_LEFT_MS = 300
    const ROTATE_90_RIGHT_MS = 300
    const ROTATE_BRAKE_SPEED = 100
    const ROTATE_BRAKE_MS = 40
    const ACTION_TIME_MS = 1000

    function stopAllMotors() {
        motor_i2cWrite(0x01, 0)
        motor_i2cWrite(0x02, 0)
        motor_i2cWrite(0x03, 0)
        motor_i2cWrite(0x04, 0)
    }

    function driveForOneSecond(leftDirection: Direction1, rightDirection: Direction1) {
        driveForMs(leftDirection, rightDirection, ACTION_TIME_MS)
    }

    function driveForMs(leftDirection: Direction1, rightDirection: Direction1, durationMs: number) {
        if (durationMs < 0) durationMs = 0
        motor(Motorlist.M1, leftDirection, DRIVE_SPEED)
        motor(Motorlist.M2, rightDirection, DRIVE_SPEED)
        basic.pause(durationMs)
        stopAllMotors()
    }

    function oppositeDirection(direction: Direction1): Direction1 {
        if (direction == Direction1.Forward) return Direction1.Backward
        return Direction1.Forward
    }

    function rotateInPlaceForMs(leftDirection: Direction1, rightDirection: Direction1, durationMs: number) {
        if (durationMs < 0) durationMs = 0
        motor(Motorlist.M1, leftDirection, ROTATE_SPEED)
        motor(Motorlist.M2, rightDirection, ROTATE_SPEED)
        basic.pause(durationMs)
        // Brief reverse pulse to reduce overshoot caused by inertia.
        motor(Motorlist.M1, oppositeDirection(leftDirection), ROTATE_BRAKE_SPEED)
        motor(Motorlist.M2, oppositeDirection(rightDirection), ROTATE_BRAKE_SPEED)
        basic.pause(ROTATE_BRAKE_MS)
        stopAllMotors()
    }

    //% block="⬆ avanzar 1s"
    //% group="CarKit Control" weight=100
    export function arrowForward() {
        driveForOneSecond(Direction1.Forward, Direction1.Forward)
    }

    //% block="⬇ retroceder 1s"
    //% group="CarKit Control" weight=99
    export function arrowBackward() {
        driveForOneSecond(Direction1.Backward, Direction1.Backward)
    }

    //% block="⬅ girar izquierda 90°"
    //% group="CarKit Control" weight=98
    export function arrowTurnLeft() {
        rotateInPlaceForMs(Direction1.Backward, Direction1.Forward, ROTATE_90_LEFT_MS)
    }

    //% block="➡ girar derecha 90°"
    //% group="CarKit Control" weight=97
    export function arrowTurnRight() {
        rotateInPlaceForMs(Direction1.Forward, Direction1.Backward, ROTATE_90_RIGHT_MS)
    }

    //% block="⬅ girar izquierda ms $durationMs"
    //% durationMs.min=0 durationMs.max=3000 durationMs.defl=300
    //% group="CarKit Dev" weight=20
    export function arrowTurnLeftMs(durationMs: number) {
        rotateInPlaceForMs(Direction1.Backward, Direction1.Forward, durationMs)
    }

    //% block="➡ girar derecha ms $durationMs"
    //% durationMs.min=0 durationMs.max=3000 durationMs.defl=300
    //% group="CarKit Dev" weight=19
    export function arrowTurnRightMs(durationMs: number) {
        rotateInPlaceForMs(Direction1.Forward, Direction1.Backward, durationMs)
    }

    //% block="⬆ avanzar $seconds s"
    //% seconds.min=0 seconds.max=10 seconds.defl=1
    //% group="CarKit Dev" weight=18
    export function arrowForwardSeconds(seconds: number) {
        driveForMs(Direction1.Forward, Direction1.Forward, Math.round(seconds * 1000))
    }

    //% block="⬇ retroceder $seconds s"
    //% seconds.min=0 seconds.max=10 seconds.defl=1
    //% group="CarKit Dev" weight=17
    export function arrowBackwardSeconds(seconds: number) {
        driveForMs(Direction1.Backward, Direction1.Backward, Math.round(seconds * 1000))
    }

    //% block="motor = | %motor Direction = | $direction speed = $pwmvalue"
    //% pwmvalue.min=0 pwmvalue.max=255 
    //% group="Motor" weight=65
    export function motor(motor: Motorlist, direction: Direction1, pwmvalue: number) {
        switch (motor) {
            case 1: // M1电机控制
                if (direction) { 
                    motor_i2cWrite(0x01, pwmvalue); motor_i2cWrite(0x02, 0); }
                else { 
                    motor_i2cWrite(0x02, pwmvalue); motor_i2cWrite(0x01, 0); }
                break;
            case 2: // M2电机控制
                if (direction) { 
                    motor_i2cWrite(0x04, pwmvalue); motor_i2cWrite(0x03, 0); }
                else { 
                    motor_i2cWrite(0x03, pwmvalue); motor_i2cWrite(0x04, 0); }
                break;
        }
    }


    //% block="LED Show"
    //% group="RGB LED" weight=65
    export function led_show() {
        let a, s, d;

        motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 255);
        motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 255);
        //红色逐渐点亮
        for (a = 255; a > 1; a--) {
            motor_i2cWrite(0x08, a);
            motor_i2cWrite(0x09, a);
            basic.pause(5);
        }
        //绿色逐渐点亮
        for (s = 255; s > 1; s--) {
            motor_i2cWrite(0x07, s);
            motor_i2cWrite(0x0a, s);
            basic.pause(5);
        }
        //红色逐渐熄灭
        for (a = 0; a < 255; a++) {
            motor_i2cWrite(0x08, a);
            motor_i2cWrite(0x09, a);
            basic.pause(5);
        }
        //blue
        for (d = 255; d > 1; d--) {
            motor_i2cWrite(0x06, d);
            motor_i2cWrite(0x05, d);
            basic.pause(5);
        }
        //green
        for (s = 0; s < 255; s++) {
            motor_i2cWrite(0x07, s);
            motor_i2cWrite(0x0a, s);
            basic.pause(5);
        }
        //rad
        for (a = 255; a > 1; a--) {
            motor_i2cWrite(0x08, a);
            motor_i2cWrite(0x09, a);
            basic.pause(5);
        }
        for (d = 0; d < 255; d++) {
            motor_i2cWrite(0x06, d);
            motor_i2cWrite(0x05, d);
            basic.pause(5);
        }
        for (a = 0; a < 255; a++) {
            motor_i2cWrite(0x08, a);
            motor_i2cWrite(0x09, a);
            basic.pause(5);
        }


    }

    //% block="LED_R= |%color PWM= |$value"
    //% direction.shadow=timePicker
    //% value.min=0 value.max=255
    //% group="RGB LED" weight=66
    export function PWM_LED_R(color: pwm_led_r, value: number) {
        motor_i2cWrite(color, value);
    }
    //% block="LED_L= |%color PWM= |$value"
    //% direction.shadow=timePicker
    //% value.min=0 value.max=255
    //% group="RGB LED" weight=67
    export function PWM_LED_L(color: pwm_led_l, value: number) {
        motor_i2cWrite(color, value);
    }

    //% block="LED OFF"
    //% group="RGB LED" weight=64
    export function LED_OFF() {
        motor_i2cWrite(0x08, 255); motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 255);
        motor_i2cWrite(0x09, 255); motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 255);
    }


    //% block="RGB = |%place color = |$color"
    //% direction.shadow=timePicker
    //% group="RGB LED" weight=68
    export function led_rgb(place: LED_rgb_L_R, color: LED_color) {
        if (place == 1) {
            switch (color) {
                case 1: { motor_i2cWrite(0x08, 0); motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 255); };
                    break;
                case 2: { motor_i2cWrite(0x08, 255); motor_i2cWrite(0x07, 0); motor_i2cWrite(0x06, 255); };
                    break;
                case 3: { motor_i2cWrite(0x08, 255); motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 0); };
                    break;
                case 4: { motor_i2cWrite(0x08, 255); motor_i2cWrite(0x07, 0); motor_i2cWrite(0x06, 0); };
                    break;
                case 5: { motor_i2cWrite(0x08, 0); motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 0); };
                    break;
                case 6: { motor_i2cWrite(0x08, 0); motor_i2cWrite(0x07, 0); motor_i2cWrite(0x06, 0); };
                    break;
                case 7: { motor_i2cWrite(0x08, 0); motor_i2cWrite(0x07, 0); motor_i2cWrite(0x06, 255); };
                    break;
                case 8: { motor_i2cWrite(0x08, 255); motor_i2cWrite(0x07, 255); motor_i2cWrite(0x06, 255); };
                    break;
            }
        }
        if (place == 0) {
            switch (color) {
                case 1: { motor_i2cWrite(0x09, 0); motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 255); };
                    break;
                case 2: { motor_i2cWrite(0x09, 255); motor_i2cWrite(0x0a, 0); motor_i2cWrite(0x05, 255); };
                    break;
                case 3: { motor_i2cWrite(0x09, 255); motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 0); };
                    break;
                case 4: { motor_i2cWrite(0x09, 255); motor_i2cWrite(0x0a, 0); motor_i2cWrite(0x05, 0); };
                    break;
                case 5: { motor_i2cWrite(0x09, 0); motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 0); };
                    break;
                case 6: { motor_i2cWrite(0x09, 0); motor_i2cWrite(0x0a, 0); motor_i2cWrite(0x05, 0); };
                    break;
                case 7: { motor_i2cWrite(0x09, 0); motor_i2cWrite(0x0a, 0); motor_i2cWrite(0x05, 255); };
                    break;
                case 8: { motor_i2cWrite(0x09, 255); motor_i2cWrite(0x0a, 255); motor_i2cWrite(0x05, 255); };
                    break;
            }
        }
    }

    /**
    * Ultrasonic sensor
    */
    const TRIG_PIN = DigitalPin.P14;
    const ECHO_PIN = DigitalPin.P15;
    pins.setPull(TRIG_PIN, PinPullMode.PullNone);
    let lastTime = 0;
    //% block="Ultrasonic"
    //% group="Ultrasonic Sensor" weight=67
    export function ultra(): number {
        //send trig pulse
        pins.digitalWritePin(TRIG_PIN, 0)
        control.waitMicros(2);
        pins.digitalWritePin(TRIG_PIN, 1)
        control.waitMicros(10);
        pins.digitalWritePin(TRIG_PIN, 0)

        // read echo pulse  max distance : 6m(35000us)
        //2020-7-6 
        // pins.pulseIn():This function has a bug and returns data with large errors.
        let t = pins.pulseIn(ECHO_PIN, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;
        //2020-7-6
        //It would normally divide by 58, because the pins.pulseIn() function has an error, so it's divided by 58
        return Math.round(ret / 58);
    }

    /**
     * photoresistance sensor
     */
    //% block="LDR_L "
    //% group="Photoresistance Sensor" weight=66
    export function PH1(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

    //% block="LDR_R "
    //% group="Photoresistance Sensor" weight=66
    export function PH2(): number {
        return pins.analogReadPin(AnalogPin.P0);
    }

    /**
* return 0b01 or 0b10
* 0b01 is the sensor on the left
* 0b10 is the sensor on the right
*/
    pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
    //% block="Line Tracking"
    //% group="Line Tracking" weight=68
    export function LineTracking(): number {
        let val = pins.digitalReadPin(DigitalPin.P12) << 0 | pins.digitalReadPin(DigitalPin.P13) << 1;
        return val;
    }

    //% block="set servo to angle %angle"
    //% group="Servo" weight=69
    //% angle.min=0 angle.max.max=180
    export function setServo(angle: number): void {
        pins.servoWritePin(AnalogPin.P2, angle)
    }
}

function motor_i2cWrite(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(address, buf)
}
