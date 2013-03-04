/**
 * ScrollFloater - jQuery Plugin
 *
 * Copyright 2013 Haruki Fukui Authors, All Rights Reserved.
 * Licensed under the MIT license (MIT) http://opensource.org/licenses/MIT
 * Version: 1.0.0
 *
 * http://closure-library.googlecode.com/svn/docs/closure_goog_ui_scrollfloater.js.source.html
 */
(function($) {

  var methods = {
    STORED_STYLE_PROPS_: ['position', 'top', 'left', 'width', 'float'],

    init: function(options) {
      methods = $.extend(methods, options);

      return this.each(function() {
        var $this = $(this),
          $window = $(window);

        $this.data('scrollingEnabled_', true);
        $this.data('floating_', false);
        $this.data('originalStyles_', {});
        $this.data('originalOffset_', $this.offset());
        $this.scrollfloater('setScrollingEnabled', $this.data('scrollingEnabled_'));
        $window.scroll($.proxy(methods.update_, this));
        $window.resize($.proxy(methods.handleResize_, this));
      });
    },
    setScrollingEnabled: function(enable) {
      $(this).data('scrollingEnabled_', enable);

      if (enable) {
        $(this).scrollfloater('update_');
      } else {
        $(this).scrollfloater('stopFloating_');
      }
    },
    isScrollingEnabled: function() {
      return $(this).data('scrollingEnabled_');
    },
    isFloating: function() {
      return $(this).data('floating_');
    },
    update_: function(e) {
      var $this = $(this);

      if ($this.data('scrollingEnabled_')) {
        var $window = $(window);
        var currentScrollTop = $window.scrollTop();
        var currentScrollLeft = $window.scrollLeft();
        var originalOffset_ = $this.data('originalOffset_');

        if (currentScrollTop > originalOffset_.top) {
          $this.css('left', originalOffset_.left - currentScrollLeft);
          $this.scrollfloater('startFloating_');
        } else {
          $this.css('left', '');
          $this.scrollfloater('stopFloating_');
        }
      }
    },
    startFloating_: function() {
      var $this = $(this);

      if ($this.data('floating_') || !$this.trigger('float')) {
        return;
      }

      var originalWidth_ = $this.width();

      var originalStyles_ = {};
      $.each(methods.STORED_STYLE_PROPS_, function(index, property) {
        originalStyles_[property] = $this.css(property);
      });
      $this.data('originalStyles_', originalStyles_);

      $this.css({
        position: 'fixed',
        top: 0,
        width: originalWidth_,
        float: 'none'
      });

      $this.data('floating_', true);
    },
    stopFloating_: function() {
      var $this = $(this);

      if (!$this.data('floating_') || !$this.trigger('dock')) {
        return;
      }

      $this.css($this.data('originalStyles_'));

      $this.data('floating_', false);
    },
    handleResize_: function(e) {
      $this = $(this);

      $this.scrollfloater('stopFloating_');
      $this.data('originalOffset_', $this.offset());
      $this.scrollfloater('update_');
    }
  };

  $.fn.scrollfloater = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method == 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.scrollfloater');
    }

  };

})(jQuery);
