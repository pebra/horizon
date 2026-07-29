import { Component } from '@theme/component';

const DEFAULT_AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD_PX = 45;

/**
 * @typedef {Object} Refs
 * @property {HTMLElement[]} slides
 * @property {HTMLElement} [viewport]
 * @property {HTMLButtonElement[]} [dots]
 * @property {HTMLButtonElement} [prevButton]
 * @property {HTMLButtonElement} [nextButton]
 * @property {HTMLButtonElement} [pauseButton]
 *
 * @extends {Component<Refs>}
 */
class BeaverkeysHeroCarousel extends Component {
  requiredRefs = ['slides'];

  /** @type {number | undefined} */
  #timer;
  #activeIndex = 0;
  #manuallyPaused = false;

  /** @type {number | null} */
  #pointerId = null;
  #pointerStartX = 0;
  #pointerStartY = 0;
  #handlePointerDown = this.#onPointerDown.bind(this);
  #handlePointerUp = this.#onPointerUp.bind(this);
  #handlePointerCancel = this.#onPointerCancel.bind(this);

  connectedCallback() {
    super.connectedCallback();
    this.#startAutoplay();

    const target = this.refs.viewport ?? this;
    target.addEventListener('pointerdown', this.#handlePointerDown);
    target.addEventListener('pointerup', this.#handlePointerUp);
    target.addEventListener('pointercancel', this.#handlePointerCancel);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#stopAutoplay();

    const target = this.refs.viewport ?? this;
    target.removeEventListener('pointerdown', this.#handlePointerDown);
    target.removeEventListener('pointerup', this.#handlePointerUp);
    target.removeEventListener('pointercancel', this.#handlePointerCancel);
  }

  /** @param {PointerEvent} event */
  #onPointerDown(event) {
    // Ignore secondary mouse buttons; let clicks on links/buttons behave normally.
    if (event.button != null && event.button !== 0) return;

    this.#pointerId = event.pointerId;
    this.#pointerStartX = event.clientX;
    this.#pointerStartY = event.clientY;
  }

  /** @param {PointerEvent} event */
  #onPointerUp(event) {
    if (this.#pointerId === null || event.pointerId !== this.#pointerId) return;

    const deltaX = event.clientX - this.#pointerStartX;
    const deltaY = event.clientY - this.#pointerStartY;
    this.#pointerId = null;

    // Only act on a mostly-horizontal drag past the threshold, so vertical
    // scrolling and plain taps/clicks are left untouched.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) {
      this.goNext();
    } else {
      this.goPrevious();
    }
    this.#restartAutoplay();
  }

  /** @param {PointerEvent} event */
  #onPointerCancel(event) {
    if (event.pointerId === this.#pointerId) this.#pointerId = null;
  }

  goNext() {
    const { slides } = this.refs;
    this.#activateSlide((this.#activeIndex + 1) % slides.length);
  }

  goPrevious() {
    const { slides } = this.refs;
    this.#activateSlide((this.#activeIndex - 1 + slides.length) % slides.length);
  }

  /** @param {number} index */
  goToSlide(index) {
    this.#activateSlide(index);
    this.#restartAutoplay();
  }

  pauseAutoplay() {
    this.#stopAutoplay();
    this.setAttribute('aria-live', 'polite');
  }

  resumeAutoplay() {
    if (this.#manuallyPaused) return;
    this.setAttribute('aria-live', 'off');
    this.#startAutoplay();
  }

  toggleAutoplay() {
    this.#manuallyPaused = !this.#manuallyPaused;
    this.setAttribute('data-paused', String(this.#manuallyPaused));

    if (this.#manuallyPaused) {
      this.#stopAutoplay();
      this.setAttribute('aria-live', 'polite');
      this.refs.pauseButton?.setAttribute('aria-label', this.dataset.playLabel ?? 'Play');
    } else {
      this.setAttribute('aria-live', 'off');
      this.#startAutoplay();
      this.refs.pauseButton?.setAttribute('aria-label', this.dataset.pauseLabel ?? 'Pause');
    }
  }

  /** @param {number} index */
  #activateSlide(index) {
    const { slides } = this.refs;
    const dots = this.refs.dots ?? [];
    const previousIndex = this.#activeIndex;

    if (!slides[previousIndex] || !slides[index] || previousIndex === index) return;

    slides[previousIndex].inert = true;
    slides[previousIndex].setAttribute('aria-hidden', 'true');
    dots[previousIndex]?.setAttribute('aria-selected', 'false');
    dots[previousIndex]?.setAttribute('tabindex', '-1');

    slides[index].inert = false;
    slides[index].removeAttribute('aria-hidden');
    dots[index]?.setAttribute('aria-selected', 'true');
    dots[index]?.setAttribute('tabindex', '0');

    this.#activeIndex = index;
  }

  #restartAutoplay() {
    if (this.#manuallyPaused) return;
    this.#startAutoplay();
  }

  #startAutoplay() {
    this.#stopAutoplay();

    const shouldAutoplay = this.dataset.autoplay === 'true';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!shouldAutoplay || reducedMotion || this.refs.slides.length <= 1) return;

    const interval = Number(this.dataset.autoplayInterval) || DEFAULT_AUTOPLAY_MS;

    this.#timer = window.setInterval(() => this.goNext(), interval);
  }

  #stopAutoplay() {
    window.clearInterval(this.#timer);
  }
}

customElements.define('beaverkeys-hero-component', BeaverkeysHeroCarousel);
