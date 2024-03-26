import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Olympic } from '../../shared/models/olympic/olympic';
import { Participation } from '../../shared/models/participation/participations';
import { OlympicServiceService } from '../../shared/services/olympic-service.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {

  public olympics: Olympic[] = [];

  public olympic: Olympic | undefined;

  public participations: Participation[] = [];

  public nameCountry!: string | undefined;
  public numberEntries: number = 0;
  public totalMedals: number = 0;
  public numberAthletes: number = 0;

  constructor(private route: ActivatedRoute,private olympicService: OlympicServiceService)
    {}

  ngOnInit(): void {
    this.getAllOlympics();
    this.pushDataInNgXCharts();
  }

  public productSalesMulti = [
      {
        "name": "book",
        "series": [
          {
            "name": "2012",
            "value": 125
          }, {
            "name": "2014",
            "value": 197
          }, {
            "name": "2015",
            "value": 209
          }
        ]
      }
  ];

  public view:[number,number] = [600, 400];
  showLabels: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';

  getAllOlympics(){
    this.olympicService.getAllOlympic()
     .subscribe({
       next: (response: Olympic[]) => { 
         this.olympics = response;
         const olympicId: string| null = this.route.snapshot.paramMap.get('id');
           if(olympicId){
             this.olympic = this.olympics.find( o => o.id == +olympicId);
           }
           if(this.olympic){
             this.nameCountry = this.olympic.country; 
             this.participations = this.olympic.participations;

             for(let i of this.participations){
               this.numberEntries += 1 ;
               this.numberAthletes += i.athleteCount;
               this.totalMedals += i.medalsCount;
             }
           }
       },
       error:(error) => {
         console.log(error);
       },
       complete:() => {}
     });
   }

   pushDataInNgXCharts(){
    if(this.olympic){
      this.productSalesMulti = [];
      for(let i =0 ; i< this.participations.length ; i++){
        this.productSalesMulti.push(
          {
            "name": this.olympic.country ,
            "series": [
              {
                "name": this.participations[i].year,
                "value": this.participations[i].medalsCount
              }
            ]
          }
        );
      }
    }
   }
}
