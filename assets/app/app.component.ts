import { Component, OnInit } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/primeng';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  items: MenuItem[];
  data: TreeNode[];

  ngOnInit() {
    this.items = [
      { label: 'New', icon: 'fa-plus' },
      { label: 'Open', icon: 'fa-download' },
      { label: 'Undo', icon: 'fa-refresh' }
    ];

    this.data = [{
      label: 'Root',
      children: [
        {
          label: 'Child 1',
          children: [
            {
              label: 'Grandchild 1.1'
            },
            {
              label: 'Grandchild 1.2'
            }
          ]
        },
        {
          label: 'Child 2',
          children: [
            {
              label: 'Child 2.1'
            },
            {
              label: 'Child 2.2'
            }
          ]
        }
      ]
    }];

  }
}
