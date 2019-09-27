import { NgModule } from "@angular/core";

import { AboutRoutingModule } from './about-routing.module';

import { AboutComponent } from './about.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProductComponent } from './product/product.component';
import { BusinessComponent } from './business/business.component';
import { FaqComponent } from './faq/faq.component';
import { Our_valuesComponent } from './our_values/our_values.component';
import { CareComponent } from './care/care.component';
import { TermComponent } from './term/term.component';
import { PolicyComponent } from './policy/policy.component';
import { RefundComponent } from './refund/refund.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
    declarations: [
        AboutComponent,
        AboutUsComponent,
        ProductComponent,
        BusinessComponent,
        FaqComponent,
        CareComponent,
        Our_valuesComponent,
        TermComponent,
        PolicyComponent,
        RefundComponent,
        AgreementComponent,
        ContactComponent,
    ],
    imports: [
        AboutRoutingModule
    ]
})

export class AboutModule { }
