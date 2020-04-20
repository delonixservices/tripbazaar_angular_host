import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subject, concat, of, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map, takeUntil, merge } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ApiService, GoogleAnalyticsService } from '../../core';

@Component({
  selector: 'app-hotel-autosuggest',
  templateUrl: './hotel-autosuggest.component.html',
  styleUrls: ['./hotel-autosuggest.component.css'],
  host: {
    '(document:click)': 'hostClick($event)',
  }
})

export class HotelAutosuggestComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  selectedArea: any;

  suggestionsLoading = false;

  suggestions: Array<any>;
  showNgSelect: boolean;
  openNgSelect: boolean;

  @ViewChild('hotelSuggestionsContainer', { static: false }) hotelSuggestionsContainer: ElementRef;

  @ViewChild('select', { static: true }) ngSelect: NgSelectComponent;

  @Output() selectedAreaChange = new EventEmitter();

  suggestionsInput = new Subject<HttpParams>();

  suggestReqQuery: any;

  totalItemsCount: number;
  currentItemsCount: number;
  page: number = 0;
  // hotels per page
  perPage: number = 15;
  totalPages: number;

  pollingStatus: string;
  allowNextIteration: boolean;
  items = [];

  constructor (
    public api: ApiService,
    public googleAnalytics: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
    this.loadDestination();
    const selectedArea = JSON.parse(localStorage.getItem('selected_area'));
    if (selectedArea && selectedArea.displayName) {
      this.selectedArea = selectedArea;
    }
  }

  suggestionsClicked(event: MouseEvent) {
    console.log(event);
    // if .hotel-suggestions is clicked
    const target = (event.target || event.srcElement || event.currentTarget) as any;

    // ng-dropdown-panel
    this.showNgSelect = true;
    // focus on ng-select input
    // The timeout is required because you can't focus() an element that is still hidden. Until Angular change detection has a chance to run (which will be after method suggestionsClicked() finishes executing), the showNgSelect property in the DOM will not be updated, even though you set showNgSelect to true in your method.
    setTimeout(() => this.ngSelect.searchInput.nativeElement.focus(), 0);

    // reset selected area
    if (target.classList.contains('hotel-suggestions') || target.classList.contains('hotel-suggestions_header') || target.classList.contains('selected_area') || target.classList.contains('selected_area-placeholder')) {
      this.selectedArea = {};
    }
  }


  hostClick(event: MouseEvent) {
    if (this.showNgSelect) {
      if (this.hotelSuggestionsContainer && this.hotelSuggestionsContainer.nativeElement && !this.hotelSuggestionsContainer.nativeElement.contains(event.target)) {
        this.showNgSelect = false;
      }
    }
  }

  scrollToEnd() {
    console.log("scrollToEnd called...");

    // control data polling
    // fetching next items is not allowed because current iteration is currently running
    if (!this.allowNextIteration) {
      return;
    }

    this.allowNextIteration = false;

    console.log(`Fetch next ${this.perPage} items...`);

    this.getData().subscribe((response) => {
      this.suggestions = this.items;
      console.log(this.items);
    });
  };

  getData(): Observable<any> {
    return new Observable((obsever) => {
      console.log(this.suggestReqQuery);

      if (!this.suggestReqQuery) {
        obsever.error('');
      }

      const reqBody = {
        'page': this.page + 1,
        'perPage': this.perPage,
        'currentItemsCount': this.currentItemsCount,
        'query': this.suggestReqQuery
      };
      this.suggestionsLoading = true;

      this.api.post("/hotels/suggest", reqBody)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response) => {
          console.log(response);

          this.totalItemsCount = response.totalItemsCount;
          this.currentItemsCount = response.currentItemsCount;
          this.page = response.page;
          // this.perPage = response.data.perPage;
          this.totalPages = response.totalPages;
          this.pollingStatus = response.status;

          if (this.pollingStatus !== "complete")
            this.allowNextIteration = true;

          this.items = this.items.concat(response.data);
          obsever.next(response.data);
          this.suggestionsLoading = false;

        }, (err) => {
          console.log(err);
          this.suggestionsLoading = false;
        });
    });
  };

  onSuggestionAdded(suggest) {
    if (!suggest) {
      return;
    }

    // google analytics
    this.googleAnalytics.eventEmitter('autosuggest', 'hotels', 'selected', `Name=${suggest.name}, Type=${suggest.type}`, 2);

    console.log(suggest);

    this.selectedArea = suggest;

    localStorage.setItem('selected_area', JSON.stringify(suggest));

    this.selectedAreaChange.emit(suggest);

    console.log(this.selectedArea);
  }

  loadDestination() {
    // console.log("loadDestination called1");
    this.openNgSelect = true;

    const data = concat(
      of([]),
      this.suggestionsInput.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
          console.log('first req');
          this.suggestionsLoading = true;
          this.page = 0;
          this.currentItemsCount = 0;
          this.items = [];
        }),
        switchMap(term => {
          this.suggestReqQuery = term;
          return this.getData().pipe(
            catchError(() => of([])), // empty list on error
            tap(() => {
              this.suggestionsLoading = false
              this.openNgSelect = true;
            })
          )
        })
      )
    );

    data.subscribe((res) => {
      this.suggestions = res
      console.log(res);
    });
  }

  ngOnDestroy() {
    // Added Ankit
    // Unsubscribing the observable after component is destroyed - prevents memory leak
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}