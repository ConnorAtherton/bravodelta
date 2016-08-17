//
// Text split effect
//
;(function(root) {
  //
  // Different character states
  //
  // state-1 => transparent
  // state-2 => Line character
  // state-3 => Block character
  // state-4 => Actualy character
  //
  const moveToState = (state, el) => {
    let newState = `state-${state}`

    el.classList.add(newState)
  }

  const advanceRandomElement = (nodes) => {
    // base condition
    if (nodes.remaining === 0) {
      return
    }

    const index = Math.floor(Math.random() * nodes.length)
    const node = nodes[index]
    const timeout = Math.floor(Math.random() * (17 - 8 + 1) + 8)

    // If it is not already complete
    if (node[0] !== 4) {
      moveToState(++node[0], node[1])

      if (node[0] === 4) {
        let index = nodes.indexOf(node)
        nodes.splice(index, 1)

        nodes.remaining--
      }
    }

    window.setTimeout(advanceRandomElement.bind(this, nodes), timeout)
  }

  const scrambleText = (el, opts = {}) => {
    // TODO: Turn selection into HTMLElement

    let newNode = el.cloneNode(false)
    let fragment = document.createDocumentFragment()

    // Collection to keep track of which nodes are finished
    let nodes = []

    const words = el.innerText.split(' ').forEach(word => {
      const wordSpan = document.createElement('span');

      word.split('').forEach(letter => {
        const letterSpan = document.createElement('span');
        letterSpan.innerText = letter

        // Set to initial state and track it
        moveToState(1, letterSpan)
        nodes.push([1, letterSpan])

        wordSpan.appendChild(letterSpan)
      })

      // To fix spacing between words. As long as the wrapper component is inline-*
      wordSpan.appendChild(document.createTextNode(' '))

      fragment.appendChild(wordSpan)
    })

    nodes.remaining = nodes.length

    // Insert back into the DOM
    newNode.appendChild(fragment)
    el.parentNode.replaceChild(newNode, el)

    // Start cycling the new nodes through the states
    advanceRandomElement(nodes)
  }

  root.scrambleText = scrambleText
})(window)
