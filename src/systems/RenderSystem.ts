//@ts-ignore
import { System } from 'ecsy'
import { renderer, mainScene, camera } from '../three'
import { Vector2, RepeatWrapping, TextureLoader, PCFSoftShadowMap } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect'

export class RenderSystem extends System {
  composer?: EffectComposer
  // This method will get called on every frame by default
  init() {
    renderer.shadowMapType = PCFSoftShadowMap
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(mainScene, camera)
    composer.addPass(renderPass)

    // const effectFXAA = new ShaderPass(FXAAShader)
    // effectFXAA.uniforms['resolution'].value.set(
    //   1 / window.innerWidth,
    //   1 / window.innerHeight
    // )
    // composer.addPass(effectFXAA)

    this.composer = composer
  }

  execute(delta: any, time: any) {
    this.composer ? this.composer.render() : renderer.render(mainScene, camera)
  }
}
