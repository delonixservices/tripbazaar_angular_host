import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
    {
        path: "about", component: AboutComponent, children: [
            { path: "about-us", component: AboutUsComponent },
            { path: "product", component: ProductComponent },
            { path: "business", component: BusinessComponent },
            { path: "faq", component: FaqComponent },
            { path: "our_values", component: Our_valuesComponent },
            { path: "care", component: CareComponent },
            { path: "term", component: TermComponent },
            { path: "policy", component: PolicyComponent },
            { path: "refund", component: RefundComponent },
            { path: "agreement", component: AgreementComponent },
            { path: "contact", component: ContactComponent },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AboutRoutingModule { }