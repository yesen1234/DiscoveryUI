
import * as d3 from 'd3';
import * as utils from '@/utils';

import { btnIcon } from '../enum';

class Group {
  constructor(params) {
    this.svg = params.svg;
    this.svgWidth = params.svgWidth;
    this.svgHeight = params.svgHeight;
    this.id = params.id || utils.makeId();
    this.x = params.x;
    this.y = params.y;
    this.title = params.title;

    this.child = params.child || [];

    this.open = params.open || false;

    this.width = 200;
    this.height = 40;

    // 私有属性
    this._group = null;
    this._btn = null;
    this._dragDeltaX = 0;
    this._dragDeltaY = 0;
    this._width = 150;
    this._height = 40;
    this._padding = 10;

    this._createElement();
    this._bindEvent();
  }

  /**
   * 创建svg元素
   */
  _createElement() {
    let len = this.child.length + 1;
    if (this.open) {
      this.height = len * (this._height + this._padding)
    } else {
      this.height = this._height;
    }
    let group = this.svg.append('g')
      .attr('transform', `translate(${this.x}, ${this.y})`);

    group.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('rx', 5)
      .attr('rx', 5)
      .attr('fill', '#fff')
      .attr('stroke', '#169ce4')
      .attr('stroke-width', '1')
      .attr('class', 'item item-rect');

    let iconGroup = group.append('g');
    iconGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', this._height)
      .attr('fill', 'none');

    iconGroup.append('image')
      .attr('href', 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg')
      .attr('x', 8)
      .attr('y', 8)
      .attr('width', 22)
      .attr('height', 22);

    let iconLine = d3.path()
    iconLine.moveTo(34, 0)
    iconLine.lineTo(34, this._height)
    iconGroup.append('path')
      .attr('stroke-width', 0.5)
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .attr('d', iconLine);

    group.append('text')
      .text(this.title)
      .attr('x', 43)
      .attr('y', 20)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start');

    this._btn = group.append('image')
      .attr('href', btnIcon[this.open])
      .attr('x', this.width - 20)
      .attr('y', 12)
      .attr('width', 16)
      .attr('height', 16);

    if(this.open) {
      let y=this._height + (this._padding / 2);
      let groupNode = group.append('g')
        .attr('transform', `translate(` + this._padding + `, ` + y + `)`)
      this.child.forEach((node, i) => this._createNode({
        svg: groupNode,
        title: node.title,
        x: this._padding,
        y: i * (this._height + this._padding),
      }));
    }

    this._group = group;
  }

  _createNode(params) {
    let group = params.svg.append('g')
      .attr('transform', `translate(${params.x}, ${params.y})`);

    group.append('rect')
      .attr('width', this._width)
      .attr('height', this._height)
      .attr('rx', 5)
      .attr('rx', 5)
      .attr('fill', '#fff')
      .attr('stroke', '#169ce4')
      .attr('stroke-width', '1')
      .attr('class', 'item item-rect')

    let iconGroup = group.append('g')
    iconGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 5)
      .attr('rx', 5)
      .attr('width', 6)
      .attr('height', this._height)
      .attr('fill', '#169ce4')
      .attr('stroke', '#169ce4')
      .attr('stroke-width', '1')

    iconGroup.append('rect')
      .attr('x', 4)
      .attr('y', 1)
      .attr('width', 30)
      .attr('height', 38)
      .attr('fill', '#fff')

    iconGroup.append('image')
      .attr('href', 'https://g.alicdn.com/aliyun/ros/1.5.4/styles/icons/ecs.svg')
      .attr('x', 8)
      .attr('y', 8)
      .attr('width', 22)
      .attr('height', 22)

    let iconLine = d3.path()
    iconLine.moveTo(34, 0)
    iconLine.lineTo(34, this._height)
    iconGroup.append('path')
      .attr('stroke-width', 0.5)
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .attr('d', iconLine)

    group.append('text')
      .text(params.title)
      .attr('x', 43)
      .attr('y', 20)
      .attr('dy', '0.35em')
      .attr('class', 'item_label')
      .attr('text-anchor', 'start')

    group.append('image')
      .attr('href', 'https://gw.alipayobjects.com/zos/rmsportal/MXXetJAxlqrbisIuZxDO.svg')
      .attr('x', this._width - 20)
      .attr('y', 12)
      .attr('width', 16)
      .attr('height', 16)
  }

  /**
   * 绑定事件
   * @private
   */
  _bindEvent() {
    this._btn.on('click', this._onClick.bind(this))

    let drag = d3.drag()
      .on("start", this._onGroupDragstart.bind(this))
      .on("drag", this._onGroupDrag.bind(this));
    this._group.call(drag);
  }

  /**
   * 开始拖拽
   * @private
   */
  _onGroupDragstart() {
    this._dragDeltaX = d3.event.x - this.x;
    this._dragDeltaY = d3.event.y - this.y;
  }

  /**
   * 正在拖拽
   * @private
   */
  _onGroupDrag() {
    this.x = d3.event.x - this._dragDeltaX;
    this.y = d3.event.y - this._dragDeltaY;
    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > this.svgWidth - this.width) {
      this.x = this.svgWidth - this.width;
    }
    if (this.y < 0) {
      this.y = 0
    }
    if (this.y > this.svgHeight - this.height) {
      this.y = this.svgHeight - this.height;
    }
    this._group.raise().attr('transform', `translate(${this.x}, ${this.y})`);
  }
  /**
   * 点击展开/折叠
   */
  _onClick() {
    d3.event.stopPropagation()
    this.open = !this.open;
    this._group.remove();
    this._createElement();
    this._bindEvent();
  }
}

export default Group;