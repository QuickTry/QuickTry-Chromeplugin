console.log("Hello there");
// // Unique ID for the className.
// var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// // Previous dom, that we want to track, so we can remove the previous styling.
// var prevDOM = null;

// // Mouse listener for any move event on the current document.
// document.addEventListener('mousemove', function (e) {
//   var srcElement = e.srcElement;

//   // Lets check if our underlying element is a DIV.
//   if (srcElement.nodeName == 'DIV') {

//     // For NPE checking, we check safely. We need to remove the class name
//     // Since we will be styling the new one after.
//     if (prevDOM != null) {
//       prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
//     }

//     // Add a visited class name to the element. So we can style it.
//     srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

//     // The current element is now the previous. So we can remove the class
//     // during the next iteration.
//     prevDOM = srcElement;
//   }
// }, false);