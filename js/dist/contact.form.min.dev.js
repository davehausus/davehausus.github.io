"use strict";

jQuery(document).ready(function (e) {
  "use strict";

  e(function () {
    e("#contact").validate({
      rules: {
        name: {
          required: !0,
          minlength: 2
        },
        email: {
          required: !0,
          email: !0
        },
        message: {
          required: !0
        }
      },
      messages: {
        name: {
          required: "If this was a movie, this is where you say your name dramatically.",
          minlength: "If this was a movie, this is where you say your name dramatically."
        },
        email: {
          required: "I need your email so I can reply back.",
          email: "I need your email so I can reply back."
        },
        message: {
          required: "Write a quick note so I know how I can help.",
          minlength: "Write a quick note so I know how I can help."
        }
      }
    });
  });
});