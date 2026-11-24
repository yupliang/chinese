import { _decorator, Component, LabelComponent, director, UIOpacity, Tween } from 'cc';
import { events } from './Global';
const { ccclass, property } = _decorator;


@ccclass('TipCtrl')
export class TipCtrl extends Component {

    @property(LabelComponent)
    text: LabelComponent = null;

    @property(UIOpacity)
    toast: UIOpacity = null;

    private _tw = new Tween();
    private time = 3;

    onEnable() {
        director.on(events.Toast, this.showToast, this);
        this._tw.target(this.toast);
        this._tw.set({ opacity: 0 }).to(0.4, { opacity: 255 }).delay(this.time).to(0.2, { opacity: 0 });
    }

    onDisable() {
        director.off(events.Toast, this.showToast, this);
    }

    /* show toast */
    showToast(text, time = 1.5) {

        this.time = time;

        this.text.string = text;

        this._tw.stop();

        this._tw.start();

    }


}


