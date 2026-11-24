import { AudioClip, AudioSourceComponent, _decorator, assetManager, AudioSource } from "cc";
import { Global, Sound } from "../Global";
import ResMgr from "./ResMgr";

const { ccclass, property } = _decorator;

@ccclass("AudioMgr")
export class AudioMgr {
    /**
     * play single clip
     */
    private _audioComp: AudioSourceComponent = null;
    /**
     * play looped clip
     */
    private _audioLoopComp: AudioSourceComponent = null;

    private _curLoopAudioName: string = "";

    private static _ins: AudioMgr = null!;

    numArrAudio: number;
    arrAudio: any[];

    public static get ins() {
        if (!this._ins) {
            this._ins = new AudioMgr();
            this._ins.initAudio();
        }

        return this._ins;
    }

    private initAudio() {
        this.numArrAudio = 0
        this.arrAudio = []
        
        this._audioComp = new AudioSourceComponent();
        this._audioComp.loop = true;
        this._audioLoopComp = new AudioSourceComponent();
        this._audioLoopComp.loop = true;
        this._audioLoopComp.volume = 0.3;
    }

    public async playMusic(path: string,scale = 1) {
        assetManager.getBundle('Bundle1').load(path, AudioClip, (err, clip: AudioClip) => {
            if (err) {
                console.error(err);
                return;
            }
            if (this._audioComp.clip) {
                this._audioComp.play();
                return;
            }
            this._audioComp.volume = scale;
            this._audioComp.clip = clip;
            this._audioComp.play(); 
        })
    }

    public playSound(path: string,scale = 1): void {
        if (!Global.canSound) {
            return
        }
    
        assetManager.getBundle('Bundle1').load(path, AudioClip, (err, clip: AudioClip) => {
            if (err) {
                console.error(err);
                return;
            }

            if (this.arrAudio.length > 15) {
                this.numArrAudio++
                if (this.numArrAudio >= this.arrAudio.length) {
                    this.numArrAudio = 0
                }
                this.arrAudio[this.numArrAudio].stop()
                this.arrAudio[this.numArrAudio].clip = clip
                this.arrAudio[this.numArrAudio].playOneShot(clip, 1);
            }else{
                let audio_source = new AudioSource
                audio_source.clip = clip
                audio_source.playOneShot(clip, 1);
                this.arrAudio.push(audio_source)
            }

            //this._audioComp.playOneShot(clip,scale)
        })
    }


    public async playMusic_1(audio: string) {

        if (this._audioComp.clip) {
            this._audioComp.play();
            return;
        }

        let clip = await ResMgr.ins.getClip(audio);
        this._audioComp.volume = 0.6;
        this._audioComp.clip = clip;
        this._audioComp.play();
    }

    public stopMusic() {
        this._audioComp.stop();
    }

    public async playSound_1(audio: string, scale = 1) {

        let clip = await ResMgr.ins.getClip(audio);
        this._audioComp.playOneShot(clip, scale);
    }
    /**
     * @description: Play loop Audio
     * @param {string} audio
     * @return {*}
     */
    public async playLoopSound(audio: string): Promise<void> {
        let clip = await ResMgr.ins.getClip(audio);
        this._audioLoopComp.stop();
        this._audioLoopComp.clip = clip;
        this._audioLoopComp.play();
        this._curLoopAudioName = audio;
    }

    public async stopLoopSound(): Promise<void> {
        this._audioLoopComp.stop();
    }

    public get curLoopAudioName(): string {
        return this._curLoopAudioName;
    }

    public isLoopAudioPlaying(): boolean {
        return this._audioLoopComp.playing;
    }

    public isMusicPlaying(): boolean {
        return this._audioComp.playing;
    }
}