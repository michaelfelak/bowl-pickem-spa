import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Bowl,
  Game,
  School,
  PickRequest,
  Entry,
  EntryRequest,
  GameResultModel,
  StandingsEntry,
  CompletedEntry,
  AnalysisRecord,
  TodaysGame,
  BlogEntry,
  BowlPick,
  Tiebreaker,
  PlayoffPickRequest,
  PlayoffSchoolRequest,
  PlayoffSchool,
  PlayoffResult as AddPlayoffResultRequest,
  PlayoffPick,
  PlayoffPickFlyout,
} from './bowl.model';

@Injectable()
export class BowlService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // this.baseUrl = 'http://localhost:8081/api/v1/'; // local
    this.baseUrl = 'https://bowl-pickem-service-5a26054c7915.herokuapp.com/api/v1/'; // prod
  }

  public getUserList() {
    return this.http.get(this.baseUrl + 'user/list');
  }

  public getBowlList(): Observable<Bowl[]> {
    return this.http.get<Bowl[]>(this.baseUrl + 'bowl/list');
  }

  public addBowl(request: any): Observable<any> {
    return this.http.post(this.baseUrl + 'bowl/add', request);
  }

  public addGame(request: Game): Observable<any> {
    return this.http.post(this.baseUrl + 'game/add', request);
  }

  public addEntry(request: EntryRequest): Observable<string> {
    return this.http.post<string>(this.baseUrl + 'entry/add', request);
  }

  public getGames(year: number): Observable<Game[]> {
    return this.http.get<Game[]>(this.baseUrl + 'game/list/' + year);
  }

  public getGameResults(year: number): Observable<GameResultModel[]> {
    return this.http.get<GameResultModel[]>(
      this.baseUrl + 'gameresults/list/' + year
    );
  }

  public addGameResult(request: GameResultModel): Observable<any> {
    return this.http.post(this.baseUrl + 'gameresult/add', request);
  }

  public getSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.baseUrl + 'school/list');
  }

  public submit(req: PickRequest): Observable<any> {
    return this.http.post(this.baseUrl + 'picks/add', req);
  }

  public addPlayoffPicks(req: PlayoffPickRequest): Observable<any> {
    return this.http.post(this.baseUrl + 'playoffpicks/add', req);
  }

  public togglePaid(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'entry/paid/' + id);
  }

  public getEntries(year: number): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.baseUrl + 'entry/list/' + year);
  }

  public deleteEntry(id: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'entry/delete/' + id);
  }

  public getStandings(year: number): Observable<StandingsEntry[]> {
    return this.http.get<StandingsEntry[]>(this.baseUrl + 'standings/' + year);
  }

  public getTiebreakers(year: number): Observable<Tiebreaker[]> {
    return this.http.get<Tiebreaker[]>(this.baseUrl + 'tiebreakers/' + year);
  }

  public getStandingsEntry(id: string | undefined): Observable<CompletedEntry> {
    return this.http.get<CompletedEntry>(this.baseUrl + 'completedentry/' + id);
  }

  public getAnalysis(year: string): Observable<AnalysisRecord[]> {
    return this.http.get<AnalysisRecord[]>(this.baseUrl + 'analysis/' + year);
  }

  public getTodaysGames(): Observable<TodaysGame[]> {
    return this.http.get<TodaysGame[]>(this.baseUrl + 'todaysgames');
  }

  public getBlogEntries(year: number): Observable<BlogEntry[]> {
    return this.http.get<BlogEntry[]>(this.baseUrl + 'blogentry/list/' + year);
  }

  public addPlayoffSchool(req: PlayoffSchoolRequest): Observable<any> {
    return this.http.post<PlayoffPickRequest>(
      this.baseUrl + 'playoffschool/add',
      req
    );
  }

  public getBowlPicks(bowlId: string): Observable<BowlPick[]> {
    return this.http.get<BowlPick[]>(this.baseUrl + 'bowlpicks/' + bowlId);
  }

  public getPlayoffSchools(year: number) {
    return this.http.get<PlayoffSchool[]>(
      this.baseUrl + 'playoffschool/list/' + year
    );
  }

  public addPlayoffResult(request: AddPlayoffResultRequest) {
    return this.http.post<AddPlayoffResultRequest[]>(
      this.baseUrl + 'playoffschool/list/',
      request
    );
  }

  public getPlayoffPickForFlyout(entryId: string) {
    return this.http.get<PlayoffPickFlyout>(
      this.baseUrl + 'playoffpicks/flyout/' + entryId
    );
  }
}
