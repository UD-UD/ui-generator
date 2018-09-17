import {
  LayoutModel
} from '../layout-definition'

import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  LAYOUT_NAME
} from '../constants/defaults'

import { DrawingManager } from '../drawing-manager/drawingManager'
import { Utils } from '../utils/utils'
import { LayoutDef } from './layout-def'
import { DummyComponent } from '../layout-component'

class LayoutManager {
  constructor (conf) {
    this.renderAt = conf.renderAt
    this.width = conf.width || DEFAULT_WIDTH
    this.height = conf.height || DEFAULT_HEIGHT
    this.skeletonType = conf.skeletonType || 'html'
    this.layoutDefinition = null
    this.layoutDef = new LayoutDef()
    if (Utils.isDOMElement(this.renderAt)) {
      this.renderAt._layout = this
    } else {
      document.getElementById(this.renderAt)._layout = this
    }
  }

  compute () {
    Utils.removeDiv(LAYOUT_NAME)
    this.calLayOutDef()
    this.layoutDefinition = this.layoutDef.getSanitizedDefinition()
    this._layout = new LayoutModel({
      width: this.width,
      height: this.height
    },
    this.layoutDefinition
    )
    this.tree = this._layout.negotiate().tree()
    this._layout.broadcast()
    this.manager = new DrawingManager(this.tree, this.skeletonType, this.renderAt)

    // this will draw all the components by calling their draw method
    this.manager.draw()
  }

  // this will auto generate the layout definition
  calLayOutDef () {

  }
  addComponent (component) {
    this.layoutDef.addComponent(component)
  }

  addMultipleComponent (componentArray) {
    this.layoutDef.addMultipleComponent(componentArray)
  }

  resetNode (node) {
    if (this.con) {
      this.con.resetNode(node)
    }
  }

  /**
   * function to update the node and rerender the layout.
   * @param  {} config - node configuration to change.
   */
  updateNode (config) {
    this.tree.updateNode(config)
    this.layoutDefinition = this.tree.model
    this.compute()
  }

  /**
   * This method will be private and only be used to create
   * layout components for default chart components such as title,legend etc
   * @param {Array<{component,name}>} rawComponents : List of Component to be added
   */
  _createLayoutComponents (rawComponentsContainer) {
    let layoutComponents = []
    // create dummy components and add them
    rawComponentsContainer.forEach(container => {
      let dummy = new DummyComponent(0, container.component.getLogicalSpace())
      dummy.component = container.component
      dummy.componentName = container.name
      dummy.target = 'canvas'
      dummy.position = container.component.position
      layoutComponents.push(dummy)
    })
    this.registerComponents(layoutComponents)
  }

  /**
  * This function takes the LayoutComponents and Register them in component store
  * @param {Array<LayoutComponent>} layoutComponents
  */
  registerComponents (layoutComponents) {
    this.addMultipleComponent(layoutComponents)
  }
}

export default LayoutManager
