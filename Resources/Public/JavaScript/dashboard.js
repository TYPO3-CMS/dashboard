/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import{LitElement as q,html as h,nothing as v}from"lit";import{state as y,query as F,customElement as M,property as X}from"lit/decorators.js";import{repeat as O}from"lit/directives/repeat.js";import{unsafeHTML as H}from"lit/directives/unsafe-html.js";import{styleMap as B}from"lit/directives/style-map.js";import{Task as W}from"@lit/task";import{fadeOut as K,fadeIn as G,animate as V}from"@lit-labs/motion";import"@typo3/backend/element/icon-element.js";import w from"@typo3/core/ajax/ajax-request.js";import Y from"@typo3/backend/storage/client.js";import{lll as o,delay as Q}from"@typo3/core/lit-helper.js";import b from"@typo3/backend/modal.js";import{SeverityEnum as $}from"@typo3/backend/enum/severity.js";import{AjaxResponse as J}from"@typo3/core/ajax/ajax-response.js";import{Categories as Z}from"@typo3/backend/new-record-wizard.js";import{topLevelModuleImport as tt}from"@typo3/backend/utility/top-level-module-import.js";import{selector as et}from"@typo3/core/literals.js";import U from"@typo3/backend/utility/dom-helper.js";import D from"@typo3/backend/notification.js";var g=function(u,t,e,a){var s=arguments.length,i=s<3?t:a===null?a=Object.getOwnPropertyDescriptor(t,e):a,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(u,t,e,a);else for(var n=u.length-1;n>=0;n--)(r=u[n])&&(i=(s<3?r(i):s>3?r(t,e,i):r(t,e))||i);return s>3&&i&&Object.defineProperty(t,e,i),i},f;(function(u){u.start="start",u.end="end",u.left="left",u.right="right",u.up="up",u.down="down"})(f||(f={}));const it="typo3:dashboard:widget:add";class A extends Event{static{this.eventName="typo3:dashboard:widget:content:rendered"}constructor(t){super(A.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.widget=t}}class E extends Event{static{this.eventName="typo3:dashboard:widget:moveIntend"}constructor(t,e){super(E.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=t,this.intend=e}}class S extends Event{static{this.eventName="typo3:dashboard:widget:remove"}constructor(t){super(S.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=t}}class T extends Event{static{this.eventName="typo3:dashboard:widget:refresh"}constructor(t){super(T.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=t}}class L extends Event{static{this.eventName="typo3:dashboard:dashboard:add"}constructor(t,e){super(L.eventName),this.preset=t,this.title=e}}class z extends Event{static{this.eventName="typo3:dashboard:dashboard:edit"}constructor(t,e){super(z.eventName),this.identifier=t,this.title=e}}class P extends Event{static{this.eventName="typo3:dashboard:dashboard:update"}constructor(t,e,a){super(P.eventName),this.identifier=t,this.widgets=e,this.widgetPositions=a}}class N extends Event{static{this.eventName="typo3:dashboard:dashboard:delete"}constructor(t){super(N.eventName),this.identifier=t}}function R(u){const t=new Set;for(let e=0;e<u.height;e++)for(let a=0;a<u.width;a++){const s=`${u.y+e}-${u.x+a}`;t.add(s)}return t}let p=class extends q{constructor(){super(),this.loading=!1,this.dashboards=[],this.currentDashboard=null,this.columns=4,this.dragInformation=null,this.resizeObserver=null,this.clientStorageIdentifier="dashboard/current_dashboard",this.prefersReducedMotion=!1,this.mql=null,this.dragOverTimeout=null,this.activeElementRef=null,this.mqListener=t=>{this.prefersReducedMotion=t.matches},this.addEventListener(T.eventName,t=>{t.preventDefault(),this.getGridItemByIdentifier(t.identifier).querySelector("typo3-dashboard-widget").refresh()}),this.addEventListener(S.eventName,t=>{t.preventDefault();const{identifier:e}=t;new w(TYPO3.settings.ajaxUrls.dashboard_widget_remove).post({dashboard:this.currentDashboard.identifier,identifier:e}).then(async a=>{const s=await a.resolve();if(s.status==="ok"){this.currentDashboard.widgets=this.currentDashboard.widgets.filter(i=>i.identifier!==e);for(const[i,r]of Object.entries(this.currentDashboard.widgetPositions)){const n=Number(i);this.currentDashboard.widgetPositions[n]=r.filter(c=>c.identifier!==e)}this.requestUpdate()}else D.error("",s.message)})}),this.addEventListener(E.eventName,t=>{t.preventDefault();const{intend:e,identifier:a}=t,s=this.widgetPositionByIdentifier(a);switch(e){case f.up:s.y=Math.max(0,s.y-1);break;case f.down:s.y++;break;case f.left:s.x=Math.max(0,s.x-1);break;case f.right:s.x=Math.min(this.columns-s.width,s.x+1);break;case f.end:document.activeElement instanceof HTMLElement&&document.activeElement.closest("typo3-dashboard")===this&&(this.activeElementRef=document.activeElement),this.widgetPositionsSort(this.currentDashboard.widgetPositions[this.columns]),this.dispatchEvent(new P(this.currentDashboard.identifier,this.currentDashboard.widgets,this.currentDashboard.widgetPositions));return;default:return}this.widgetPositionChange(this.currentDashboard.widgetPositions[this.columns],s),this.updateComplete.then(()=>{const i=this.getGridItemByIdentifier(a);if(i){const r=e!==f.up;U.scrollIntoViewIfNeeded(i,r)}})}),this.addEventListener(L.eventName,t=>{t.preventDefault();const{preset:e,title:a}=t;new w(TYPO3.settings.ajaxUrls.dashboard_dashboard_add).post({preset:e,title:a}).then(async s=>{const i=await s.resolve();if(i.status==="ok"){const r=i.dashboard;this.dashboards.push(r);const n=this.getDashboardByIdentifier(r.identifier)||this.getDashboardFirst();this.selectDashboard(n),this.requestUpdate()}else D.error("",i.message)})}),this.addEventListener(z.eventName,t=>{t.preventDefault();const{identifier:e,title:a}=t;new w(TYPO3.settings.ajaxUrls.dashboard_dashboard_edit).post({identifier:e,title:a}).then(async s=>{const i=await s.resolve();if(i.status==="ok"){const r=this.dashboards.filter(l=>l.identifier===e)[0],n=this.dashboards.indexOf(r),c=i.dashboard;this.dashboards[n]=c,r.identifier===c.identifier&&this.selectDashboard(c),this.requestUpdate()}else D.error("",i.message)})}),this.addEventListener(P.eventName,t=>{t.preventDefault();const{identifier:e,widgets:a,widgetPositions:s}=t;new w(TYPO3.settings.ajaxUrls.dashboard_dashboard_update).post({identifier:e,widgets:a,widgetPositions:s}).then(async i=>{const r=await i.resolve();if(r.status==="ok"){const n=this.dashboards.filter(d=>d.identifier===e)[0],c=this.dashboards.indexOf(n),l=r.dashboard;this.dashboards[c]=l,n.identifier===l.identifier&&this.selectDashboard(l),this.requestUpdate()}else D.error("",r.message)})}),this.addEventListener(N.eventName,t=>{t.preventDefault();const{identifier:e}=t;new w(TYPO3.settings.ajaxUrls.dashboard_dashboard_delete).post({identifier:e}).then(async a=>{const s=await a.resolve();if(s.status==="ok"){this.dashboards=this.dashboards.filter(r=>r.identifier!==e);const i=this.getDashboardFirst();this.selectDashboard(i),this.requestUpdate()}else D.error("",s.message)})})}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(t=>{for(const e of t){const{width:a}=e.contentRect;a>950?this.columns=4:a>750?this.columns=2:this.columns=1}}),this.resizeObserver.observe(this),this.mql=window.matchMedia("(prefers-reduced-motion: reduce)"),this.mqListener(this.mql),this.mql.addEventListener("change",this.mqListener)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.mql?.removeEventListener("change",this.mqListener),this.mql=null}firstUpdated(){this.load()}updated(){this.activeElementRef&&(this.activeElementRef.focus(),this.activeElementRef=null)}createRenderRoot(){return this}render(){return this.loading?this.renderLoader():h`${this.renderHeader()}<div class=dashboard-container @dragend=${this.handleDragEnd} @dragover=${this.handleDragOver} @dragstart=${this.handleDragStart}>${this.renderContent()}<div class=dashboard-dragging-container></div></div>${this.renderFooter()}`}async load(){this.loading=!0,this.dashboards=await this.fetchDashboards();const t=Y.get(this.clientStorageIdentifier),e=this.getDashboardByIdentifier(t)||this.getDashboardFirst();this.selectDashboard(e),this.loading=!1}async fetchData(t){try{return(await new w(t).get({cache:"no-cache"})).resolve()}catch(e){return console.error(e),[]}}async fetchPresets(){const t=await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_presets_get);return Object.values(t)}async fetchCategories(){const t=await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_categories_get);return Z.fromData(t)}async fetchDashboards(){return await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_dashboards_get)}getDashboardByIdentifier(t){return this.dashboards.find(e=>e.identifier===t)||null}getDashboardFirst(){return this.dashboards.length>0?this.dashboards[0]:null}async createDashboard(){const e=(await this.fetchPresets()).filter(s=>s.showInWizard),a=h`<form><div class=form-group><label class=form-label for=dashboard-form-add-title>${o("dashboard.title")}</label> <input class=form-control id=dashboard-form-add-title type=text name=title required></div><div class=dashboard-modal-items>${O(e,s=>s.identifier,(s,i)=>h`<div class=dashboard-modal-item><input type=radio name=preset value=${s.identifier} class=dashboard-modal-item-checkbox id=dashboard-form-add-preset-${s.identifier} ?checked=${i===0}> <label for=dashboard-form-add-preset-${s.identifier} class=dashboard-modal-item-block><span class=dashboard-modal-item-icon> <typo3-backend-icon identifier=${s.icon} size=medium></typo3-backend-icon> </span> <span class=dashboard-modal-item-details><span class=dashboard-modal-item-title>${s.title}</span> <span class=dashboard-modal-item-description>${s.description}</span> </span></label></div>`)}</div></form>`;b.advanced({type:b.types.default,title:o("dashboard.add"),size:b.sizes.medium,severity:$.notice,content:a,callback:s=>{s.addEventListener("typo3-modal-shown",()=>{s.querySelector("#dashboard-form-add-title")?.focus()}),s.querySelector("form").addEventListener("submit",i=>{i.preventDefault();const r=i.target,n=new FormData(r);this.dispatchEvent(new L(n.get("preset"),n.get("title"))),s.hideModal()})},buttons:[{text:o("dashboard.add.button.close"),btnClass:"btn-default",name:"cancel",trigger:(s,i)=>i.hideModal()},{text:o("dashboard.add.button.ok"),btnClass:"btn-primary",name:"save",trigger:(s,i)=>i.querySelector("form").requestSubmit()}]})}editDashboard(t){const e=h`<form><div class=form-group><label class=form-label for=dashboard-form-edit-title>${o("dashboard.title")}</label> <input class=form-control id=dashboard-form-edit-title type=text name=title value=${t.title||""} required></div></form>`;b.advanced({type:b.types.default,title:o("dashboard.configure"),size:b.sizes.small,severity:$.notice,content:e,callback:a=>{a.addEventListener("typo3-modal-shown",()=>{a.querySelector("#dashboard-form-edit-title")?.focus()}),a.querySelector("form").addEventListener("submit",s=>{s.preventDefault();const i=s.target,r=new FormData(i);this.dispatchEvent(new z(t.identifier,r.get("title"))),a.hideModal()})},buttons:[{text:o("dashboard.configure.button.close"),btnClass:"btn-default",name:"cancel",trigger:(a,s)=>s.hideModal()},{text:o("dashboard.configure.button.ok"),btnClass:"btn-primary",name:"save",trigger:(a,s)=>s.querySelector("form").requestSubmit()}]})}deleteDashboard(t){const e=b.confirm(o("dashboard.delete"),o("dashboard.delete.sure"),$.warning,[{text:o("dashboard.delete.cancel"),active:!0,btnClass:"btn-default",name:"cancel"},{text:o("dashboard.delete.ok"),btnClass:"btn-warning",name:"delete"}]);e.addEventListener("button.clicked",a=>{a.target.getAttribute("name")==="delete"&&this.dispatchEvent(new N(t.identifier)),e.hideModal()})}selectDashboard(t){t!==null&&Y.set(this.clientStorageIdentifier,t.identifier),this.currentDashboard=t}async addWidget(){tt("@typo3/backend/new-record-wizard.js");const t=top.document.createElement("typo3-backend-new-record-wizard");t.searchPlaceholder=o("widget.addToDashboard.searchLabel"),t.searchNothingFoundLabel=o("widget.addToDashboard.searchNotFound"),t.categories=await this.fetchCategories(),t.addEventListener(it,async e=>{const{identifier:a}=e.detail.item,i=await(await new w(TYPO3.settings.ajaxUrls.dashboard_widget_add).post({dashboard:this.currentDashboard.identifier,type:a})).resolve();if(i.status==="ok"){this.currentDashboard.widgets.push(i.widget),this.requestUpdate(),await this.updateComplete;const r=this.getGridItemByIdentifier(i.widget.identifier);r&&(U.scrollIntoViewIfNeeded(r,!0),window.setTimeout(()=>r.querySelector(".widget-actions > button:first-child")?.focus({preventScroll:!0,focusVisible:!1}),50))}else D.error("",i.message)}),b.advanced({type:b.types.default,title:o("widget.addToDashboard",this.currentDashboard.title),size:b.sizes.medium,severity:$.notice,content:t,callback:e=>{e.addEventListener("button.clicked",()=>{e.hideModal()})},buttons:[{text:o("widget.add.button.close"),btnClass:"btn-default",name:"cancel"}]})}renderLoader(){return h`<div class=dashboard-loader><typo3-backend-spinner size=medium></typo3-backend-spinner></div>`}renderHeader(){const t=h`<button class="btn btn-primary btn-sm btn-dashboard-add-tab" title=${o("dashboard.add")} @click=${()=>{this.createDashboard()}}><typo3-backend-icon identifier=actions-plus size=small></typo3-backend-icon><span class=visually-hidden>${o("dashboard.add")}</span></button>`,e=this.currentDashboard!==null?h`<button class="btn btn-default btn-sm" title=${o("dashboard.configure")} @click=${()=>{this.editDashboard(this.currentDashboard)}}><typo3-backend-icon identifier=actions-cog size=small></typo3-backend-icon><span class=visually-hidden>${o("dashboard.configure")}</span></button>`:v,a=this.currentDashboard!==null?h`<button class="btn btn-default btn-sm" title=${o("dashboard.delete")} @click=${()=>{this.deleteDashboard(this.currentDashboard)}}><typo3-backend-icon identifier=actions-delete size=small></typo3-backend-icon><span class=visually-hidden>${o("dashboard.delete")}</span></button>`:v;return h`<div class=dashboard-header><h1 class=visually-hidden>${this.currentDashboard?.title}</h1><div class=dashboard-header-container><div class=dashboard-tabs>${O(this.dashboards,s=>s.identifier,s=>h`<button @click=${()=>{this.selectDashboard(s)}} class=dashboard-tab${s===this.currentDashboard?" dashboard-tab--active":""}>${s.title}</button>`)} ${t}</div>${e||a?h`<div class="dashboard-configuration btn-toolbar" role=toolbar>${e}${a}</div>`:v}</div></div>`}renderContent(){if(this.currentDashboard){if(this.currentDashboard.widgets.length>0){this.initializeCurrentDashboard();const t={keyframeOptions:{duration:250,fill:"both"},in:G,out:K,skipInitial:!0,disabled:this.prefersReducedMotion};return h`<div class=dashboard-grid style=${B({"--columns":this.columns})}>${O(this.currentDashboard.widgetPositions[this.columns],e=>e.identifier,e=>h`<div class=dashboard-item style=${B({"--col-start":e.x+1,"--col-span":e.width,"--row-start":e.y+1,"--row-span":e.height})} data-widget-hash=${e.identifier} data-widget-key=${this.widgetByIdentifier(e.identifier)?.type} data-widget-identifier=${e.identifier} draggable=true @pointerenter=${a=>a.target.setAttribute("draggable","true")} @widgetrefresh=${()=>this.handleLegacyWidgetRefreshEvent(e)} ${V(t)}><typo3-dashboard-widget .identifier=${e.identifier}></typo3-dashboard-widget></div>`)}</div>`}return h`<div class=dashboard-empty><div class=dashboard-empty-content><h3>${o("dashboard.empty.content.title")}</h3><p>${o("dashboard.empty.content.description")}</p><button title=${o("widget.add")} class="btn btn-primary" @click=${()=>{this.addWidget()}}><typo3-backend-icon identifier=actions-plus size=small></typo3-backend-icon>${o("dashboard.empty.content.button")}</button></div></div>`}return v}renderFooter(){return this.currentDashboard===null?v:h`<div class=dashboard-add-item><button class="btn btn-primary btn-dashboard-add-widget" title=${o("widget.addToDashboard",this.currentDashboard.title)} @click=${()=>{this.addWidget()}}><typo3-backend-icon identifier=actions-plus size=small></typo3-backend-icon><span class=visually-hidden>${o("widget.addToDashboard",this.currentDashboard.title)}</span></button></div>`}getGridItemByIdentifier(t){return this.querySelector(et`.dashboard-item[data-widget-identifier="${t}"]`)}handleDragStart(t){const a=t.target.closest(".dashboard-item");if(a===null){t.preventDefault();return}if(document.elementFromPoint(t.clientX,t.clientY).closest(".widget-header")===null){t.preventDefault();return}const i=a.dataset.widgetIdentifier,r=this.widgetPositionByIdentifier(i),n=a.getBoundingClientRect(),c=a.querySelector("typo3-dashboard-widget");c.style.pointerEvents="none",this.dragInformation={identifier:i,itemElement:a,widgetElement:c,height:r.height,width:r.width,offsetY:t.clientY-n.top,offsetX:t.clientX-n.left,currentY:r.y,currentX:r.x,initialPositions:this.currentDashboard.widgetPositions[this.columns].map(d=>({...d}))};const l=new Image;l.src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",t.dataTransfer.setDragImage(l,0,0),t.dataTransfer.setData("text/plain",""),t.dataTransfer.effectAllowed="move",a.classList.add("dashboard-item-dragging"),this.positionDraggingElement(t),this.draggingContainer.appendChild(c)}positionDraggingElement(t){const e=(d,m,x)=>Math.min(x,Math.max(m,d)),{itemElement:a,widgetElement:s}=this.dragInformation,i=a.getBoundingClientRect(),r=this.querySelector(".dashboard-container").getBoundingClientRect(),n=20,c=e(t.clientX-this.dragInformation.offsetX,r.left-n,r.left+r.width-i.width+n),l=Math.max(r.top-n,t.clientY-this.dragInformation.offsetY);s.style.left=`${c}px`,s.style.top=`${l}px`,s.style.width=`${i.width}px`,s.style.height=`${i.height}px`}handleDragEnd(){if(this.dragInformation){const{itemElement:t,widgetElement:e}=this.dragInformation;t.classList.remove("dashboard-item-dragging"),t.appendChild(e),e.removeAttribute("style"),this.dragInformation=null,this.widgetPositionsSort(this.currentDashboard.widgetPositions[this.columns]),this.dispatchEvent(new P(this.currentDashboard.identifier,this.currentDashboard.widgets,this.currentDashboard.widgetPositions))}}handleDragOver(t){if(this.dragInformation){t.preventDefault(),t.dataTransfer.dropEffect="move",this.positionDraggingElement(t);const e=this.querySelector(".dashboard-grid"),a=e.getBoundingClientRect(),s=parseInt(getComputedStyle(e).gap,10),i=parseInt(getComputedStyle(e).gridAutoRows,10)+s,r=(a.width+s)/this.columns,n=Math.max(0,t.clientY-a.top-this.dragInformation.offsetY),c=Math.max(0,t.clientX-a.left-this.dragInformation.offsetX),l=Math.max(0,Math.round(n/i)),d=Math.max(0,Math.min(Math.round(c/r),this.columns-this.dragInformation.width));(this.dragInformation.currentY!==l||this.dragInformation.currentX!==d)&&(this.dragInformation.currentY=l,this.dragInformation.currentX=d,this.dragOverTimeout&&clearTimeout(this.dragOverTimeout),this.dragOverTimeout=window.setTimeout(()=>{if(this.dragInformation){const m=this.widgetPositionByIdentifier(this.dragInformation.identifier);m.y=this.dragInformation.currentY,m.x=this.dragInformation.currentX,this.widgetPositionChange(this.currentDashboard.widgetPositions[this.columns],m)}},100))}}handleLegacyWidgetRefreshEvent(t){this.dispatchEvent(new T(t.identifier))}initializeCurrentDashboard(){this.currentDashboard.widgetPositions=this.currentDashboard.widgetPositions??{};let t=this.currentDashboard.widgetPositions?.[this.columns]??[];const e={small:1,medium:2,large:4},a={small:1,medium:2,large:3};this.currentDashboard.widgets.forEach(s=>{if(t.find(i=>i.identifier===s.identifier)===void 0){const i=a[s.height]??1,r=e[s.width]??1,n={identifier:s.identifier,height:i,width:r<this.columns?r:this.columns,y:0,x:0};t.push(n)}}),t=this.widgetPositionsArrange(t),this.widgetPositionsCollapseRows(t),this.currentDashboard.widgetPositions[this.columns]=t}widgetByIdentifier(t){return this.currentDashboard.widgets.find(e=>e.identifier===t)??null}widgetPositionByIdentifier(t){return this.currentDashboard.widgetPositions[this.columns].find(e=>e.identifier===t)??null}widgetPositionCanPlace(t,e,a,s){return e<0||e>this.columns-t.width||a<0?!1:s.isDisjointFrom(R({...t,x:e,y:a}))}widgetPositionChange(t,e){let a=structuredClone(this.dragInformation?.initialPositions??t);const s=a.findIndex(r=>r.identifier===e.identifier);let i;if(s>-1){const[r]=a.splice(s,1);i={...r},r.y=e.y,r.x=e.x,a.unshift(r)}a=this.widgetPositionsArrange(a,this.dragInformation?.initialPositions??t,i),t.forEach(r=>{const n=a.find(c=>c.identifier===r.identifier);r.y=n.y,r.x=n.x}),this.widgetPositionsCollapseRows(t),this.requestUpdate()}widgetTryPlacementInNeighbourCells(t,e,a){const s=this.columns;for(let i=t.x;i>=Math.max(0,t.x-t.width);i--)if(this.widgetPositionCanPlace(t,i,t.y,e))return{...t,x:i};for(let i=t.y;i>=0;i--)if(this.widgetPositionCanPlace(t,t.x,i,e))return{...t,y:i};for(let i=t.x;i<=Math.min(s,t.x+t.width);i++)if(this.widgetPositionCanPlace(t,i,t.y,e))return{...t,x:i};for(let i=t.y;i<=t.y+(a?.height??3);i++)if(this.widgetPositionCanPlace(t,t.x,i,e))return{...t,y:i};return null}widgetPositionsArrange(t,e,a){let s=new Set;const i=d=>this.widgetPositionCanPlace(d,d.x,d.y,s)?{...d}:null,r=d=>e===void 0?null:this.widgetTryPlacementInNeighbourCells(d,e.reduce((m,x)=>m.union(R(x)),new Set).difference(R(a)).union(s),a),n=d=>this.widgetTryPlacementInNeighbourCells(d,s),c=d=>{const m=Math.max(0,d.y),x=Math.max(0,Math.min(this.columns-d.width,d.x)),j=Math.max(0,x),_=this.columns;for(let C=d.y;C<m+100;C++)for(let I=j;I<_;I++)if(this.widgetPositionCanPlace(d,I,C,s))return{...d,x:I,y:C};throw new Error("Logic error: could not occupy cells")},l=d=>(s=s.union(R(d)),d);return t.map(d=>l(i(d)??r(d)??n(d)??c(d)))}widgetPositionsCollapseRows(t){const e=new Set;t.forEach(i=>{for(let r=0;r<i.height;r++)e.add(i.y+r)});const a={};let s=0;for(let i=0;i<=Math.max(...e);i++)e.has(i)&&(a[i]=s++);t.forEach(i=>{i.y=a[i.y]})}widgetPositionsSort(t){t.sort((e,a)=>e.y!==a.y?e.y-a.y:e.x-a.x)}};g([y()],p.prototype,"loading",void 0),g([y()],p.prototype,"dashboards",void 0),g([y()],p.prototype,"currentDashboard",void 0),g([y()],p.prototype,"columns",void 0),g([y()],p.prototype,"dragInformation",void 0),g([F(".dashboard-dragging-container")],p.prototype,"draggingContainer",void 0),p=g([M("typo3-dashboard")],p);let k=class extends q{constructor(){super(...arguments),this.moving=!1,this.triggerContentRenderedEvent=!1,this.fetchTask=new W(this,{args:()=>[this.identifier],task:async([t],{signal:e})=>{const a=TYPO3.settings.ajaxUrls.dashboard_widget_get,i=await(await new w(a).withQueryArguments({widget:t}).get({signal:e})).resolve();if(i.status!=="ok")throw new Error(i.message);return i.widget},onComplete:async()=>{this.triggerContentRenderedEvent=!0},onError:t=>{console.error(`Error while retrieving widget [${this.identifier}]: ${t instanceof J?`${t.response.status} ${t.response.statusText}`:t.message}`)}})}get widget(){return this.fetchTask.value??null}refresh(){this.handleRefresh()}createRenderRoot(){return this}updated(){if(this.triggerContentRenderedEvent){this.triggerContentRenderedEvent=!1;const{widget:t}=this;this.dispatchEvent(new A(t)),this.dispatchEvent(new CustomEvent("widgetContentRendered",{bubbles:!0,detail:this.widget.eventdata}))}}render(){const t=h`<div class=widget-loader><typo3-backend-spinner size=medium></typo3-backend-spinner></div>`,e=n=>n?.label||"ERROR",a=n=>n?H(n.content):h`<div class=widget-content-main>${o("widget.error")}</div>`,s=(n=!1)=>h`<button type=button title=${o("widget.refresh")} class="widget-action widget-action-refresh" @click=${this.handleRefresh}>${n?h`<typo3-backend-spinner size=small></typo3-backend-spinner>`:h`<typo3-backend-icon identifier=actions-refresh size=small></typo3-backend-icon>`} <span class=visually-hidden>${o("widget.refresh")}</span></button>`,i=(n,c=!1)=>h`<div class=widget-header><div class=widget-title>${e(n)}</div><div class=widget-actions>${n?.options?.refreshAvailable?s(c):v} <button type=button title=${o("widget.move")} class="widget-action widget-action-move" @click=${this.handleMoveClick} @focusout=${this.handleMoveFocusOut} @keydown=${this.handleMoveKeyDown}><typo3-backend-icon identifier=${this.moving?"actions-thumbtack":"actions-move"} size=small></typo3-backend-icon><span class=visually-hidden>${o("widget.move")}</span></button> <button type=button title=${o("widget.remove")} class="widget-action widget-action-remove" @click=${this.handleRemove}><typo3-backend-icon identifier=actions-delete size=small></typo3-backend-icon><span class=visually-hidden>${o("widget.remove")}</span></button></div></div><div class=widget-content @pointerenter=${l=>l.target.closest(".dashboard-item").removeAttribute("draggable")} @pointerleave=${l=>l.target.closest(".dashboard-item").setAttribute("draggable","true")}>${a(n)}</div>`,r=this.fetchTask.render({initial:()=>v,error:()=>i(null),pending:()=>this.fetchTask.value?i(this.fetchTask.value,!0):Q(80,()=>t),complete:n=>i(n)});return h`<div class="widget ${this.moving?" widget-selected":""}">${r}</div>`}moveStart(){this.moving===!1&&(this.moving=!0,this.dispatchEvent(new E(this.widget.identifier,f.start)))}moveEnd(){this.moving===!0&&(this.moving=!1,this.dispatchEvent(new E(this.widget.identifier,f.end)))}handleMoveClick(){this.moving?this.moveEnd():this.moveStart()}handleMoveFocusOut(){this.moveEnd()}handleMoveKeyDown(t){if(!this.moving||!["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","Home","End","Enter","Space","Escape","Tab"].includes(t.code)||t.altKey||t.ctrlKey)return;t.preventDefault(),t.stopPropagation();let a=f.end;switch(t.code){case"Escape":case"Enter":case"Space":this.moveEnd();return;case"ArrowUp":a=f.up;break;case"ArrowDown":a=f.down;break;case"ArrowLeft":a=f.left;break;case"ArrowRight":a=f.right;break;default:return}this.dispatchEvent(new E(this.widget.identifier,a))}handleRefresh(){this.fetchTask.run()}handleRemove(t){const e=b.confirm(o("widget.remove.confirm.title"),o("widget.remove.confirm.message"),$.warning,[{text:o("widget.remove.button.close"),active:!0,btnClass:"btn-default",name:"cancel"},{text:o("widget.remove.button.ok"),btnClass:"btn-warning",name:"delete"}]);e.addEventListener("button.clicked",s=>{s.target.getAttribute("name")==="delete"&&this.dispatchEvent(new S(this.identifier)),e.hideModal()});const a=t.currentTarget;e.addEventListener("typo3-modal-hide",()=>{a?.focus()})}};g([X({type:String,reflect:!0})],k.prototype,"identifier",void 0),g([y()],k.prototype,"moving",void 0),k=g([M("typo3-dashboard-widget")],k);export{p as Dashboard,k as DashboardWidget,A as DashboardWidgetContentRenderedEvent};
