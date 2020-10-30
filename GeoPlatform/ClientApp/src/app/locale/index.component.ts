import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

@Component({
  templateUrl: 'index.component.html'
})

export class LocaleIndexComponent implements OnInit {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polskie' }
  ];

  constructor(@Inject(LOCALE_ID) protected locale: string) { }

  ngOnInit() { }
}
