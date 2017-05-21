import { Component, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';

declare var ace:  any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public languages: string[] = ['Java', 'C++', 'Python'];
  language: string = 'Java';
  sessionId :string;
  build: string;
  execute: string;

  defaultContent={
    'Java':`public class Example{
      public static void main(String[] args){
          //Type your code
      }
    }`,
    'C++':`#include <iostream>
    using namespace std;
    int main(){
      //Type your C++ code here
      return 0;
    }`,
    'Python':`class Solution:
    def example():
        # Write your Python code here`
  }

  format={
    'Java' : 'java',
    'C++' : 'c_cpp',
    'Python' : 'python'
  }

  editor:any;

  constructor(@Inject("collaboration") private collaboration,
              @Inject("data") private data,
              private route: ActivatedRoute) {

   }

  ngOnInit() {
    this.route.params
        .subscribe( params => {
          this.sessionId = params['id'];
          this.initEditor();
        });
    }

  initEditor(){
    this.editor = ace.edit("editor");
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.$blockScrolling = Infinity;

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change',(e)=>{
      console.log('editor change:' + JSON.stringify(e));
      if(this.editor.lastAppliedChange != e){
          this.collaboration.change(JSON.stringify(e));
      }
    });
    this.editor.getSession().getSelection().on('changeCursor',()=>{
      let cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor move:' + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    })

    this.collaboration.restoreBuffer();
  }

  setlanguage(language:string){
    this.language = language;
    this.resetEditor();
  }

  resetEditor() : void{
    this.editor.getSession().setMode('ace/mode/' + this.format[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
    this.build = "";
    this.execute = "";
  }

  submit() :void {
    let user_code = this.editor.getValue();
    let data = {
      user_code : this.editor.getValue(),
      lang: this.language.toLowerCase()
    };
    this.data.buildAndRun(data).then(res => {console.log(res) ;this.build = res.build; this.execute = res.execute});

  }
}
