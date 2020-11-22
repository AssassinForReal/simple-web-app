(() => {
  const hFloatingLabels = document.querySelectorAll('.floating-label')

  hFloatingLabels.forEach(hFloatingLabel => {
    const hInput = hFloatingLabel.querySelector('input') ||
      hFloatingLabel.querySelector('select')
      
    if (!hInput) return

    if (hInput.value) {
      hFloatingLabel.classList.add('float')
    }

    hInput.addEventListener('focusin', () => {
      hFloatingLabel.classList.add('float')
    })

    hInput.addEventListener('focusout', () => {
      if (!hInput.value) {
        hFloatingLabel.classList.remove('float')
      }
    })
  })
})()
