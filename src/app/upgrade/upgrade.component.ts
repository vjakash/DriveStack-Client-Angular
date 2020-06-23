import { Component, OnInit, NgZone } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as CryptoJS from 'crypto-js';
import { ICustomWindow, WindowRefService } from '../window-ref.service';
import { Router } from '@angular/router';
import { ServerservService } from '../serverserv.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css'],
})
export class UpgradeComponent implements OnInit {
  faTimes = faTimes;
  faCheck = faCheck;
  userData;
  private _window: ICustomWindow;
  public rzp: any;
  loader=true;
  public options: any = {
    key: 'rzp_test_VOOCC5sS9NmTSF', // add razorpay key here
    name: 'Drive Stack',
    description: 'Upgrade Storage',
    amount: 100, // razorpay takes amount in paisa
    order_id: "order_EzPOcsMLDnuBa9",
    prefill: {
      name: 'uname',
      email: 'uname@gmail.com', // add your email id
    },
    notes: {},
    theme: {
      color: '#3880FF',
    },
    handler: this.paymentHandler.bind(this),
    modal: {
      ondismiss: () => {
        this.zone.run(() => {
          // alert('Payment Failled....Retry after some time');
          this.showDanger('Payment Failled....Retry after some time');
          this.router.navigate(['/dashboard/upgrade']);
          // add current page routing if payment fails
        });
      },
    },
  };

  constructor(
    private serv: ServerservService,
    private zone: NgZone,
    private winRef: WindowRefService,
    private router: Router,
    private toastService: ToastService
  ) {
    this._window = this.winRef.nativeWindow;
    this.serv.getUserData().subscribe((data)=>{
      this.userData=data;
      this.loader=false;
    },(err)=>{
      console.log(err);
    })
  }
  initPay(price): void {
    // this.winRef.getOrderId(parseFloat(price)*100,id).subscribe((data)=>{
    //   console.log(data);
    // },(err)=>console.log(err))
    this.serv.createOrder(parseFloat(price)*100).subscribe((data)=>{
      console.log(data);
      this.options.amount = parseFloat(price) * 100;
      this.options.order_id=data.id;
    this.rzp = new this.winRef.nativeWindow['Razorpay'](this.options);
    this.rzp.open();
    })
    
  }
  paymentHandler(res: any) {
    this.zone.run(() => {
      // add API call here
      console.log(res);
      
      let generated_signature = CryptoJS.HmacSHA256(res.razorpay_order_id + "|" + res.razorpay_payment_id,"V3iI59d2EyyBpKAxThdGHLTT");
      if (generated_signature == res.razorpay_signature) {
          console.log("payment is successful");
          // this.router.navigate(["/payment-successfull"])
          this.serv.upgrade().subscribe((data)=>{
            this.showSuccess("Storage Upgraded");
          },(err)=>{
            this.showDanger(err.error.message);
          })
          this.router.navigate(['/dashboard/upgrade']);
      }
      else{
        console.log(generated_signature,res.razorpay_signature)
        this.showDanger("There is some error!Please try again");
        this.router.navigate(['/dashboard/upgrade']);
      }
    });
  }
  ngOnInit(): void {}
  common = {
    higlight: 'Unlimited',
    period: '/month',
  };
  arr = [
    {
      tier: 'free',
      price: '0$',
      list: [
        'Single User',
        '5GB Storage',
        'Unlimited Public Projects',
        'Community Access',
        'Unlimited Private Projects',
        'Dedicated Phone Support',
        'Free Subdomain',
        'Monthly Status Reports',
      ],
    },
    {
      tier: 'Plus',
      price: '500',
      list: [
        '2GB Storage',
        'Unlimited retrieval',
        'Community Access',
        'High security',
        'Dedicated server',
        'Monthly Status Reports',
      ],
    },
    {
      tier: 'Pro',
      price: '$49',
      list: [
        'Unlimited User',
        '150Gb Storage',
        'Unlimited Public Projects',
        'Community Access',
        'Unlimited Private Projects',
        'Dedicated Phone Support',
        'Unlimited Free Subdomain',
        'Monthly Status Reports',
      ],
    },
  ];
  free(listItem, i) {
    if (listItem.tier == 'free' && i > 3) {
      return true;
    } else {
      return false;
    }
  }
  plus(listItem, i) {
    if (listItem.tier == 'Plus' && i == listItem.list.length - 1) {
      return true;
    } else {
      return false;
    }
  }
  textMuted(item, i) {
    if (
      (item.tier == 'free' && i > 3) ||
      (item.tier == 'Plus' && i == item.list.length - 1)
    ) {
      console.log(item, i);
      return 'text-muted';
    }
  }
  showStandard(msg) {
    this.toastService.show(msg);
  }

  showSuccess(msg) {
    this.toastService.show(msg, {
      classname: 'bg-success text-light',
      delay: 4000,
    });
  }

  showDanger(msg) {
    this.toastService.show(msg, {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }
}
