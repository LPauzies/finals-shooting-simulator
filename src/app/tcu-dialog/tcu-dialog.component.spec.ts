import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcuDialogComponent } from './tcu-dialog.component';

describe('TcuDialogComponent', () => {
  let component: TcuDialogComponent;
  let fixture: ComponentFixture<TcuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcuDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TcuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
