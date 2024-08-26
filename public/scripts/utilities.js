export function toggleRotate(event) {
    event.preventDefault()
    const target = event.currentTarget
    const mark = target.querySelector('.mark')
    mark.classList.toggle('rotated')
}