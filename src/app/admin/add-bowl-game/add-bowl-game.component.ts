import { Component, Input, OnInit, inject } from '@angular/core';
import { BowlService } from '../../shared/services/bowl.service';
import {
  Bowl,
  Game,
  GameResultModel,
  School,
} from '../../shared/services/bowl.model';
import { mergeMap } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  standalone: true,
  selector: 'app-add-bowl-game',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyInputBoxModule,
    
  ],
  providers: [SettingsService],
  templateUrl: './add-bowl-game.component.html',
  styleUrls: ['./add-bowl-game.component.scss'],
})
export class AddBowlGameComponent implements OnInit {
  public hour = 1;
  public minute = 0;
  public channel!: string;
  public year: number;
  public gameDate!: Date;
  public selectedBowl: Bowl = {};
  public selectedSchool1: School = {};
  public selectedSchool2: School = {};
  public isChampionship = false;
  public isPlayoff = false;
  public bowls: Bowl[] = [];
  public schools: School[] = [];
  public addMessage!: string;

  protected formGroup: FormGroup<{
    hour: FormControl<number | null>;
    minute: FormControl<number | null>;
    year: FormControl<number | null>;
    month: FormControl<number | null>;
    day: FormControl<number | null>;
  }>;

  constructor(private svc: BowlService,
    private settings: SettingsService) {
    this.formGroup = inject(FormBuilder).group({
      hour: new FormControl(12),
      minute: new FormControl(0),
      year: new FormControl(this.settings.currentYear),
      month: new FormControl(12),
      day: new FormControl(16),
    });
    this.year = this.settings.currentYear;
  }

  public ngOnInit() {
    this.refresh();
  }

  public refresh() {
    this.svc
      .getSchools()
      .pipe(
        mergeMap((result: School[]) => {
          this.schools = result;
          if (this.schools) {
            this.selectedSchool1 = this.schools[0];
            this.selectedSchool2 = this.schools[1];
          }
          return this.svc.getBowlList();
        })
      )
      .subscribe(
        (result: Bowl[]) => {
          this.bowls = result;
          this.sortBowls();
          if (this.bowls) {
            this.selectedBowl = this.bowls[0];
          }
        },
        (err: Error) => {
          console.log('error reaching the web service: ', err);
        }
      );
  }

  public sortBowls() {
    if (this.bowls) {
      this.bowls.sort((a: Bowl, b: Bowl) => {
        return a.name! > b.name! ? 1 : -1;
      });
    }
  }

  public addBowlGame() {
    this.addMessage = '';
    const game: Game = {};
    game.BowlID = this.selectedBowl.id;
    game.School1ID = this.selectedSchool1.ID;
    game.School2ID = this.selectedSchool2.ID;
    game.Year = this.year;
    game.GameTime = new Date(
      this.formGroup.value.year as number,
      (this.formGroup.value.month as number) - 1,
      this.formGroup.value.day as number,
      this.formGroup.value.hour as number,
      this.formGroup.value.minute as number
    );
    game.IsPlayoff = this.isPlayoff;
    game.IsChampionship = this.isChampionship;
    this.svc.addGame(game).subscribe(() => {
      this.addMessage = this.selectedBowl.name + ' Bowl Added!';
    });
    const r: GameResultModel = {};
    r.score_1 = 0;
    r.score_2 = 0;

    this.svc.addGameResult(r).subscribe();
  }

  public setSchool(id: string, num: number) {
    if (num === 1) {
      this.selectedSchool1 = this.getSchoolFromID(id);
    } else if (num === 2) {
      this.selectedSchool2 = this.getSchoolFromID(id);
    }
  }

  public getSchoolFromID(id: string): School {
    if (this.schools) {
      if (this.schools) {
        return this.schools.filter(function (school) {
          return school.ID === id;
        })[0];
      }
    }
    return {} as School;
  }

  public setBowlGame(id: string | undefined) {
    this.selectedBowl = this.getBowlFromID(id);
  }

  private getBowlFromID(id: string | undefined): Bowl {
    return this.bowls.filter(function (bowl) {
      return bowl.id === id;
    })[0];
  }
}
