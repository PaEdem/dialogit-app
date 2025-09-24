<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="modal-mask"
    >
      <div class="modal-container">
        <div class="modal-body">
          <div
            class="modal-info"
            v-html="formattedGeminiResult"
          ></div>
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
import { computed } from 'vue';
import { marked } from 'marked';
import { useStore } from '../stores/store';

const props = defineProps({
  show: Boolean,
});

const store = useStore();

const formattedGeminiResult = computed(() => {
  if (store.geminiResult) {
    return marked.parse(store.geminiResult);
  }
  return '';
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
  width: 960px;
  margin: auto;
  padding: 1rem;
  background-color: var(--back);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 1rem;
}
.modal-info {
  color: var(--grey-4);
  font-size: 1.1rem;
}
.modal-info h2 {
  text-align: center;
  margin: 0;
  padding-bottom: 0.5rem;
  font-weight: 600;
  color: var(--heading);
}
.modal-info h3 {
  margin: 0;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 0;
  color: var(--text);
}
.modal-info ul {
  padding: 0.5rem 0 1rem;
}
.modal-info li::marker {
  content: '';
}
.modal-info li strong {
  font-weight: 500;
  color: var(--title);
}
.modal-info ul li ul li {
  padding-left: 1rem;
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
