import { _decorator, Component, Node, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundMgr')
export class SoundMgr extends Component {
    start() {

    }

    playSound(str){
        let n_sound = this.node.getChildByName(str)
        if (n_sound && n_sound.getComponent(AudioSource)) {
            n_sound.getComponent(AudioSource).play()
        }else{
            console.log('播放音效失败！');
        }
    }

    update(deltaTime: number) {
        
    }
}

