# MiniCar Extension (MakeCode micro:bit)

Extension para controlar el carro MiniCar de KEYESTUDIO en MakeCode.

## Instalar como extension

1. Abre [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Crea un proyecto nuevo
3. Ve a **Extensions**
4. Importa la URL de este repositorio

## Categorias de bloques

- `CarKit Control`
  - `avanzar 1s`
  - `retroceder 1s`
  - `girar izquierda 90°`
  - `girar derecha 90°`
- `CarKit Dev` (pruebas y calibracion)
  - `girar izquierda ms`
  - `girar derecha ms`
  - `avanzar X s`
  - `retroceder X s`

## Pines usados

- IR receiver: `P16`
- Ultrasonic: `P14` (Trig), `P15` (Echo)
- LDR izquierda: `P1`
- LDR derecha: `P0`
- Line tracking izquierda: `P12`
- Line tracking derecha: `P13`
- Servo: `P2`

## Vista previa de bloques

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
</script>

## Metadata

- for `PXT/microbit`

