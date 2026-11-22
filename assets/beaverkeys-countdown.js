import { Component } from '@theme/component';

const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

/**
 * @typedef {Object} Refs
 * @property {HTMLElement} timer
 * @property {HTMLElement} daysUnit
 * @property {HTMLElement} days
 * @property {HTMLElement} hours
 * @property {HTMLElement} minutes
 * @property {HTMLElement} seconds
 * @property {HTMLElement} reveal
 *
 * @extends {Component<Refs>}
 */
class BeaverkeysCountdown extends Component {
  requiredRefs = ['timer', 'daysUnit', 'days', 'hours', 'minutes', 'seconds', 'reveal'];

  /** @type {number | undefined} */
  #timer;

  connectedCallback() {
    super.connectedCallback();

    const endTime = Date.parse(this.dataset.endTime ?? '');
    if (Number.isNaN(endTime)) return;

    this.#render(endTime);
    this.#timer = window.setInterval(() => this.#render(endTime), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.#timer);
  }

  /** @param {number} endTime */
  #render(endTime) {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    if (remaining === 0) {
      window.clearInterval(this.#timer);
      this.dataset.state = 'live';
      this.refs.timer.hidden = true;
      this.refs.reveal.hidden = false;
      return;
    }

    const days = Math.floor(remaining / SECONDS_PER_DAY);
    const previousSeconds = this.refs.seconds.textContent?.trim();

    this.refs.daysUnit.hidden = days === 0;
    this.refs.days.textContent = pad(days);
    this.refs.hours.textContent = pad(Math.floor((remaining % SECONDS_PER_DAY) / SECONDS_PER_HOUR));
    this.refs.minutes.textContent = pad(Math.floor((remaining % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE));
    this.refs.seconds.textContent = pad(remaining % SECONDS_PER_MINUTE);

    if (previousSeconds !== this.refs.seconds.textContent) this.#pressKey(this.refs.seconds);
  }

  /** @param {HTMLElement} key */
  #pressKey(key) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    key.animate(
      [
        { translate: '0 0' },
        { translate: '0 5px', boxShadow: '0 2px 0 var(--beaverkeys-countdown-key-skirt), 0 6px 12px rgb(0 0 0 / 0.3)' },
        { translate: '0 0' },
      ],
      { duration: 220, easing: 'ease-out' }
    );
  }
}

/** @param {number} value */
function pad(value) {
  return String(value).padStart(2, '0');
}

customElements.define('beaverkeys-countdown-component', BeaverkeysCountdown);
