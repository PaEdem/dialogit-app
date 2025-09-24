<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="modal-mask"
    >
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-info">Dialogi on ohi</div>
        </div>
        <div class="modal-footer">
          <div class="grow"></div>
          <button
            class="btn blue"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined icon"> close </span>
            Sulje
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
});
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}
.modal-container {
  width: 640px;
  margin: auto;
  padding: 1rem 1.5rem;
  background-color: var(--pink);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 0 1rem;
}
.modal-info {
  color: var(--red);
  font-size: 1.5rem;
  font-weight: 600;
}
.modal-footer {
  display: flex;
  padding: 0.5rem 1rem;
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
