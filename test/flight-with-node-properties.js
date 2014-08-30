define(function(require) {
  'use strict';

  describeMixin('lib/index', function() {
    beforeEach(function() {
      this.Component = this.Component.mixin(function() {
        this.nodeProperties({
          foo: 1,
          publish: {
            bar: 2,
            baz: {value: 3, reflect: true}
          }
        });

        this.fooChanged = function() {
          this.changed.foo = Array.prototype.slice.call(arguments);
        };

        this.barChanged = function() {
          this.changed.bar = Array.prototype.slice.call(arguments);
        };

        this.bazChanged = function(oldValue, newValue) {
          this.changed.baz = Array.prototype.slice.call(arguments);
        };

        this.after('initialize', function() {
          this.changed = {};
          this.initializeNodeProperties();
        });
      });
    });

    it('should define properties and attributes', function() {
      setupComponent();

      var node = this.component.node;
      expect(node.foo).to.eql(1);
      expect(node.bar).to.eql(2);
      expect(node.baz).to.eql(3);
      expect(node.getAttribute('foo')).not.to.be.ok();
      expect(node.getAttribute('bar')).not.to.be.ok();
      expect(node.getAttribute('baz')).to.be('3');
    });

    it('should set properties values from default attributes', function() {
      this.$node = $('<div foo="4" bar="5" baz="6"/>').appendTo('body');
      this.component = new this.Component().initialize(this.$node, {});

      var node = this.component.node;
      expect(node.foo).to.eql(1);
      expect(node.bar).to.eql(5);
      expect(node.baz).to.eql(6);
      expect(node.getAttribute('foo')).to.be('4');
      expect(node.getAttribute('bar')).to.be('5');
      expect(node.getAttribute('baz')).to.be('6');
    });

    it('should publish properties as attributes', function() {
      setupComponent();

      var node = this.component.node;
      node.setAttribute('foo', 4);
      node.setAttribute('bar', 5);
      node.setAttribute('baz', 6);

      expect(node.foo).to.eql(1);
      expect(node.bar).to.eql(5);
      expect(node.baz).to.eql(6);
      expect(node.getAttribute('foo')).to.be('4');
      expect(node.getAttribute('bar')).to.be('5');
      expect(node.getAttribute('baz')).to.be('6');
    });

    it('should reflect properties to attributes', function() {
      setupComponent();

      var node = this.component.node;
      node.foo = 4;
      node.bar = 5;
      node.baz = 6;

      expect(node.foo).to.eql(4);
      expect(node.bar).to.eql(5);
      expect(node.baz).to.eql(6);
      expect(node.getAttribute('foo')).not.to.be.ok();
      expect(node.getAttribute('bar')).not.to.be.ok();
      expect(node.getAttribute('baz')).to.be('6');
    });

    it('should call handler', function() {
      setupComponent();

      expect(this.component.changed.foo).to.eql([undefined, 1]);
      expect(this.component.changed.bar).to.eql([undefined, 2]);
      expect(this.component.changed.baz).to.eql([undefined, 3]);

      this.component.changed = {};

      var node = this.component.node;
      node.foo = 4;
      node.bar = 5;
      node.baz = 6;

      expect(this.component.changed.foo).to.eql([1, 4]);
      expect(this.component.changed.bar).to.eql([2, 5]);
      expect(this.component.changed.baz).to.eql([3, 6]);
    });

    it('should call handler by changing attributes', function() {
      setupComponent();

      this.component.changed = {};

      var node = this.component.node;
      node.setAttribute('foo', 4);
      node.setAttribute('bar', 5);
      node.setAttribute('baz', 6);

      expect(this.component.changed.foo).not.to.ok();
      expect(this.component.changed.bar).to.eql([2, 5]);
      expect(this.component.changed.baz).to.eql([3, 6]);
    });

    it('should merge definitions', function() {
      this.Component = this.Component.mixin(function() {
        this.nodeProperties({
          publish: {
            foo: {value: 4, reflect: true},
            bar: 5
          },
          qux: 7
        });
      });

      setupComponent();

      var node = this.component.node;
      expect(node.foo).to.eql(4);
      expect(node.bar).to.eql(5);
      expect(node.baz).to.eql(3);
      expect(node.qux).to.eql(7);
      expect(node.getAttribute('foo')).to.be('4');
      expect(node.getAttribute('bar')).not.to.be.ok();
      expect(node.getAttribute('baz')).to.be('3');
      expect(node.getAttribute('qux')).not.to.be.ok();
    });
  });
});
