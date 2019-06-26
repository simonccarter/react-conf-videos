import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
// required by boostrapEndRemoveLoaderEpic
(arr => {
  arr.forEach(item => {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode === null) {
          return;
        }
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
