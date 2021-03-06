import { HttpClient } from '@angular/common/http';
import { AlertModalService } from './../../shared/alert-modal.service';
import { Professor } from './../../professores/professor';
import { CrudService } from './../../shared/crud-service';
import { DisciplinasService } from './../disciplinas.service';
import { Component, OnInit } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-disciplinas-form',
  templateUrl: './disciplinas-form.component.html',
  styleUrls: ['./disciplinas-form.component.scss']
})
export class DisciplinasFormComponent implements OnInit {

  professores: any[];

  form: FormGroup;
  submitted = false;

  constructor(private service: DisciplinasService, private modal: AlertModalService,
    private fb: FormBuilder,private route: ActivatedRoute, private location: Location,
    private http: HttpClient) { }

  ngOnInit(): void {


    this.onRefresh()

    const disciplina = this.route.snapshot.data['disciplina'];

    this.form = this.fb.group({

      id: [disciplina.id],
      nome: [disciplina.nome, [Validators.required,Validators.minLength(4),Validators.maxLength(50)]],
      descricao: [disciplina.descricao, [Validators.required,Validators.maxLength(200)]],
      cargaHoraria: [disciplina.cargaHoraria, [Validators.required]],
      ativa: [disciplina.ativa],
      professor: [disciplina.professor,[Validators.required]]
    });

  }

  onRefresh() {
    this.service.listProf().
     pipe(
      map(professores => professores.map(p => ({
        'id': p.id,
        'nome': p.nome
      }))),
      tap(console.log)
    ).subscribe(dados => this.professores = dados);
  }


  setAtiva(){

    if(this.form.value.ativa === true){

      this.form.value.ativa = 1;

    }else{

      this.form.value.ativa = 0;
    }

  }

  compararProfessores(obj1, obj2) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2;
  }


  hasError(field: string) {

    return this.form.get(field).errors;
  }

  onSubmit() {

    this.submitted = true;

    console.log(this.form.value);
    if(this.form.valid) {

      console.log('submit');

      let msgSuccess = 'Disciplina criado com sucesso';
      let msgError = 'Erro ao criar disciplina curso, tente novamente!';

      if(this.form.value.id) {
        msgSuccess = 'Disciplina atualizado com sucesso';
        msgError = 'Erro ao atualizar disciplina, tente novamente!';

      }

      this.setAtiva()
      this.service.save(this.form.value).subscribe(
        success => { this.modal.showAlertSuccess(msgSuccess),
        this.location.back()},

        error => this.modal.showAlertDanger(msgError)
      );
    }

  }

  handleError(){
    this.modal.showAlertDanger('Erro ao carregar alunos. Tenta novamente mais tarde.');

  }

  onCancel() {

    this.submitted = false;
    this.form.reset();
  }

}
