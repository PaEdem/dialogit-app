<!-- \\src\components\Modal.vue -->
<template>
  <Transition name="modal">
    <div
      v-if="uiStore.isModalActive"
      class="modal-mask"
      @click.self="uiStore.hideModal()"
    >
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-info">
            <slot></slot>
          </div>
        </div>

        <div class="modal-footer">
          <div class="grow"></div>
          <button
            class="btn grey"
            @click="uiStore.hideModal()"
          >
            <span class="material-symbols-outlined icon">close</span>
            Sulje
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore';
const uiStore = useUiStore();
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.modal-container {
  flex: 0 1 60%;
  min-width: 640px;
  margin: auto;
  padding: 1rem;
  background-color: var(--grey-95);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transition: all 0.3s ease;
}
.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 0.5rem 0 1rem;
}
.modal-info h3 {
  margin: 0;
  font-size: var(--subtitle);
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 0;
  color: var(--red-20);
}
.modal-info ul {
  padding: 0.5rem 0 1rem;
}
.modal-info li {
  font-size: var(--subtext);
  color: var(--winkle-20);
  font-style: italic;
  margin-bottom: 0.25rem;
}
.modal-info li::marker {
  content: '';
}
.modal-info li strong,
.modal-info li code,
.modal-info li strong code {
  font-family: 'Roboto Condensed', 'Open Sans', 'Roboto', 'Segoe UI', sans-serif !important;
  font-weight: 500;
  color: var(--red-30);
}
.modal-info ul li ul li {
  padding-left: 1rem;
}
.ohi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.ohi-title {
  font-size: var(--title);
  text-align: center;
  padding: 2rem;
  margin: 0 auto;
  color: var(--red-20);
}
.ohi-message {
  font-size: var(--subtitle);
  text-align: center;
  padding: 2rem;
  margin: 0 auto;
  color: var(--red-20);
}
.modal-footer {
  display: flex;
  padding: 0.5rem 2rem;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
