import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { NgAudioRecorderService, OutputFormat, ErrorCase, RecorderState } from 'ng-audio-recorder';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  recording = false;
  errorCase: ErrorCase;

  audio: Blob;
  blobUrl;

  canplay = false;

  constructor(
    private audioRecorderService: NgAudioRecorderService,
    private alertController: AlertController,
    private domSanitizer: DomSanitizer
  ) {
    this.audioRecorderService.recorderError.subscribe(recorderErrorCase => {
      this.presentAlert(recorderErrorCase);
    });
  }


  // getUserContent(): Promise<MediaStream>;
    // pause(): void;
    // resume(): void;
    // stopRecording(outputFormat: OutputFormat): Promise<unknown>;
  getRecorderState(): string {
    let message = '';
    const data = this.audioRecorderService.getRecorderState();

    if (data === 0) {
      message = 'Initializing';
    } else if (data === 1 ) {
      message = 'Initialized';
    }else if (data === 2 ) {
      message = 'Recording';
    } else if (data === 3) {
      message = 'Paused';
    } else if (data === 4) {
      message = 'Stopping';
    } else if (data === 5 ) {
      message = 'Stopped';
    }

    return message;
  }

  /**
   * start audio recording
   */
  startRecording() {
    this.recording = true;
    this.audioRecorderService.startRecording();
  }

  /**
   * stop the recording and return blob
   */
  stopRecording() {
    const outputFormat = OutputFormat;
    this.recording = false;

    this.audioRecorderService.stopRecording(outputFormat.WEBM_BLOB).then((output: Blob) => {
      this.audio = output;

      this.blobUrl = URL.createObjectURL(output);
      this.blobUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
    }).catch(errorCase => {
      this.presentAlert(errorCase);
    });
  }

  playBlob() {
    this.canplay = true;
  }

  stopPlay() {
    this.canplay = false;
  }

  /**
   * show the error alert
   * @param error number
   */
  async presentAlert(error: number) {
    let errorMessage = '';
    this.recording = false;

    if (error === 0) {
      errorMessage = 'User consent failed';
    } else if (error === 1) {
      errorMessage = 'Recorder timeout';
    } else if (error === 2) {
      errorMessage = 'Already recording';
    }

    const alert = await this.alertController.create({
      subHeader: 'Oops!!!',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }

  
}
