const snabbdom = require('snabbdom');
const { h } = snabbdom;

class CounterComponent {
  constructor() {
    this.state = { count: 0 };
    this.listeners = [];
    this.onMountCallbacks = [];
    this.logLifecycleEvent('Component mounted');
  }

  setTemplate(templateFunction) {
    this.template = templateFunction;
    this.render(); // Initial render
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.logLifecycleEvent('State updated');
  }

  addEventListener(eventType, listener) {
    this.listeners.push({ eventType, listener });
  }

  onMount(callback) {
    this.onMountCallbacks.push(callback);
  }

  render() {
    const newVNode = this.template(this.state);

    if (this.oldVNode) {
      this.patch(this.oldVNode, newVNode);
    } else {
      const container = document.getElementById('app');
      snabbdom.init([/* modules */]);
      snabbdom.patch(container, newVNode);
      this.onMountCallbacks.forEach(callback => callback());
    }

    this.oldVNode = newVNode;
  }

  patch(oldVNode, newVNode) {
    snabbdom.patch(oldVNode, newVNode);
  }

  logLifecycleEvent(event) {
    console.log(event);
  }
}

// Example usage:
const counterComponent = new CounterComponent();

function counterTemplate(state) {
  return h('div', [
    h('h1', `Count: ${state.count}`),
    h('button', { on: { click: () => counterComponent.updateState({ count: state.count + 1 }) } }, 'Increment'),
  ]);
}

counterComponent.setTemplate(counterTemplate);

counterComponent.addEventListener('click', () => {
  console.log('Button clicked');
});

counterComponent.onMount(() => {
  console.log('Counter component mounted');
});
