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
var DashboardWidgetMoveIntend,__decorate=function(e,t,i,a){var s,r=arguments.length,d=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)d=Reflect.decorate(e,t,i,a);else for(var n=e.length-1;n>=0;n--)(s=e[n])&&(d=(r<3?s(d):r>3?s(t,i,d):s(t,i))||d);return r>3&&d&&Object.defineProperty(t,i,d),d};import{html,LitElement,nothing}from"lit";import{customElement,property,state,query}from"lit/decorators.js";import{repeat}from"lit/directives/repeat.js";import{unsafeHTML}from"lit/directives/unsafe-html.js";import{styleMap}from"lit/directives/style-map.js";import{Task}from"@lit/task";import{animate,fadeIn,fadeOut}from"@lit-labs/motion";import"@typo3/backend/element/icon-element.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import ClientStorage from"@typo3/backend/storage/client.js";import{lll,delay}from"@typo3/core/lit-helper.js";import Modal from"@typo3/backend/modal.js";import{SeverityEnum}from"@typo3/backend/enum/severity.js";import{AjaxResponse}from"@typo3/core/ajax/ajax-response.js";import{Categories}from"@typo3/backend/new-record-wizard.js";import{topLevelModuleImport}from"@typo3/backend/utility/top-level-module-import.js";import{selector}from"@typo3/core/literals.js";import DomHelper from"@typo3/backend/utility/dom-helper.js";import Notification from"@typo3/backend/notification.js";!function(e){e.start="start",e.end="end",e.left="left",e.right="right",e.up="up",e.down="down"}(DashboardWidgetMoveIntend||(DashboardWidgetMoveIntend={}));const newRecordWizardEventName="typo3:dashboard:widget:add";export class DashboardWidgetContentRenderedEvent extends Event{constructor(e){super(DashboardWidgetContentRenderedEvent.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.widget=e}}DashboardWidgetContentRenderedEvent.eventName="typo3:dashboard:widget:content:rendered";class DashboardWidgetMoveIntendEvent extends Event{constructor(e,t){super(DashboardWidgetMoveIntendEvent.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=e,this.intend=t}}DashboardWidgetMoveIntendEvent.eventName="typo3:dashboard:widget:moveIntend";class DashboardWidgetRemoveEvent extends Event{constructor(e){super(DashboardWidgetRemoveEvent.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=e}}DashboardWidgetRemoveEvent.eventName="typo3:dashboard:widget:remove";class DashboardWidgetRefreshEvent extends Event{constructor(e){super(DashboardWidgetRefreshEvent.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.identifier=e}}DashboardWidgetRefreshEvent.eventName="typo3:dashboard:widget:refresh";class DashboardAddEvent extends Event{constructor(e,t){super(DashboardAddEvent.eventName),this.preset=e,this.title=t}}DashboardAddEvent.eventName="typo3:dashboard:dashboard:add";class DashboardEditEvent extends Event{constructor(e,t){super(DashboardEditEvent.eventName),this.identifier=e,this.title=t}}DashboardEditEvent.eventName="typo3:dashboard:dashboard:edit";class DashboardUpdateEvent extends Event{constructor(e,t,i){super(DashboardUpdateEvent.eventName),this.identifier=e,this.widgets=t,this.widgetPositions=i}}DashboardUpdateEvent.eventName="typo3:dashboard:dashboard:update";class DashboardDeleteEvent extends Event{constructor(e){super(DashboardDeleteEvent.eventName),this.identifier=e}}function createSet(e){const t=new Set;for(let i=0;i<e.height;i++)for(let a=0;a<e.width;a++){const s=`${e.y+i}-${e.x+a}`;t.add(s)}return t}DashboardDeleteEvent.eventName="typo3:dashboard:dashboard:delete";let Dashboard=class extends LitElement{constructor(){super(),this.loading=!1,this.dashboards=[],this.currentDashboard=null,this.columns=4,this.dragInformation=null,this.resizeObserver=null,this.clientStorageIdentifier="dashboard/current_dashboard",this.prefersReducedMotion=!1,this.mql=null,this.dragOverTimeout=null,this.activeElementRef=null,this.mqListener=e=>{this.prefersReducedMotion=e.matches},this.addEventListener(DashboardWidgetRefreshEvent.eventName,(e=>{e.preventDefault();this.getGridItemByIdentifier(e.identifier).querySelector("typo3-dashboard-widget").refresh()})),this.addEventListener(DashboardWidgetRemoveEvent.eventName,(e=>{e.preventDefault();const{identifier:t}=e;new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_widget_remove).post({dashboard:this.currentDashboard.identifier,identifier:t}).then((async e=>{const i=await e.resolve();if("ok"===i.status){this.currentDashboard.widgets=this.currentDashboard.widgets.filter((e=>e.identifier!==t));for(const[e,i]of Object.entries(this.currentDashboard.widgetPositions)){const a=Number(e);this.currentDashboard.widgetPositions[a]=i.filter((e=>e.identifier!==t))}this.requestUpdate()}else Notification.error("",i.message)}))})),this.addEventListener(DashboardWidgetMoveIntendEvent.eventName,(e=>{e.preventDefault();const{intend:t,identifier:i}=e,a=this.widgetPositionByIdentifier(i);switch(t){case DashboardWidgetMoveIntend.up:a.y=Math.max(0,a.y-1);break;case DashboardWidgetMoveIntend.down:a.y++;break;case DashboardWidgetMoveIntend.left:a.x=Math.max(0,a.x-1);break;case DashboardWidgetMoveIntend.right:a.x=Math.min(this.columns-a.width,a.x+1);break;case DashboardWidgetMoveIntend.end:return document.activeElement instanceof HTMLElement&&document.activeElement.closest("typo3-dashboard")===this&&(this.activeElementRef=document.activeElement),this.widgetPositionsSort(this.currentDashboard.widgetPositions[this.columns]),void this.dispatchEvent(new DashboardUpdateEvent(this.currentDashboard.identifier,this.currentDashboard.widgets,this.currentDashboard.widgetPositions));default:return}this.widgetPositionChange(this.currentDashboard.widgetPositions[this.columns],a),this.updateComplete.then((()=>{const e=this.getGridItemByIdentifier(i);if(e){const i=t!==DashboardWidgetMoveIntend.up;DomHelper.scrollIntoViewIfNeeded(e,i)}}))})),this.addEventListener(DashboardAddEvent.eventName,(e=>{e.preventDefault();const{preset:t,title:i}=e;new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_dashboard_add).post({preset:t,title:i}).then((async e=>{const t=await e.resolve();if("ok"===t.status){const e=t.dashboard;this.dashboards.push(e);const i=this.getDashboardByIdentifier(e.identifier)||this.getDashboardFirst();this.selectDashboard(i),this.requestUpdate()}else Notification.error("",t.message)}))})),this.addEventListener(DashboardEditEvent.eventName,(e=>{e.preventDefault();const{identifier:t,title:i}=e;new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_dashboard_edit).post({identifier:t,title:i}).then((async e=>{const i=await e.resolve();if("ok"===i.status){const e=this.dashboards.filter((e=>e.identifier===t))[0],a=this.dashboards.indexOf(e),s=i.dashboard;this.dashboards[a]=s,e.identifier===s.identifier&&this.selectDashboard(s),this.requestUpdate()}else Notification.error("",i.message)}))})),this.addEventListener(DashboardUpdateEvent.eventName,(e=>{e.preventDefault();const{identifier:t,widgets:i,widgetPositions:a}=e;new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_dashboard_update).post({identifier:t,widgets:i,widgetPositions:a}).then((async e=>{const i=await e.resolve();if("ok"===i.status){const e=this.dashboards.filter((e=>e.identifier===t))[0],a=this.dashboards.indexOf(e),s=i.dashboard;this.dashboards[a]=s,e.identifier===s.identifier&&this.selectDashboard(s),this.requestUpdate()}else Notification.error("",i.message)}))})),this.addEventListener(DashboardDeleteEvent.eventName,(e=>{e.preventDefault();const{identifier:t}=e;new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_dashboard_delete).post({identifier:t}).then((async e=>{const i=await e.resolve();if("ok"===i.status){this.dashboards=this.dashboards.filter((e=>e.identifier!==t));const e=this.getDashboardFirst();this.selectDashboard(e),this.requestUpdate()}else Notification.error("",i.message)}))}))}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((e=>{for(const t of e){const{width:e}=t.contentRect;this.columns=e>950?4:e>750?2:1}})),this.resizeObserver.observe(this),this.mql=window.matchMedia("(prefers-reduced-motion: reduce)"),this.mqListener(this.mql),this.mql.addEventListener("change",this.mqListener)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.mql?.removeEventListener("change",this.mqListener),this.mql=null}firstUpdated(){this.load()}updated(){this.activeElementRef&&(this.activeElementRef.focus(),this.activeElementRef=null)}createRenderRoot(){return this}render(){return this.loading?this.renderLoader():html`${this.renderHeader()}<div class="dashboard-container" @dragend="${this.handleDragEnd}" @dragover="${this.handleDragOver}" @dragstart="${this.handleDragStart}">${this.renderContent()}<div class="dashboard-dragging-container"></div></div>${this.renderFooter()}`}async load(){this.loading=!0,this.dashboards=await this.fetchDashboards();const e=ClientStorage.get(this.clientStorageIdentifier),t=this.getDashboardByIdentifier(e)||this.getDashboardFirst();this.selectDashboard(t),this.loading=!1}async fetchData(e){try{return(await new AjaxRequest(e).get({cache:"no-cache"})).resolve()}catch(e){return console.error(e),[]}}async fetchPresets(){const e=await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_presets_get);return Object.values(e)}async fetchCategories(){const e=await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_categories_get);return Categories.fromData(e)}async fetchDashboards(){return await this.fetchData(TYPO3.settings.ajaxUrls.dashboard_dashboards_get)}getDashboardByIdentifier(e){return this.dashboards.find((t=>t.identifier===e))||null}getDashboardFirst(){return this.dashboards.length>0?this.dashboards[0]:null}async createDashboard(){const e=(await this.fetchPresets()).filter((e=>e.showInWizard)),t=html`<form><div class="form-group"><label class="form-label" for="dashboard-form-add-title">${lll("dashboard.title")}</label> <input class="form-control" id="dashboard-form-add-title" type="text" name="title" required="required"></div><div class="dashboard-modal-items">${repeat(e,(e=>e.identifier),((e,t)=>html`<div class="dashboard-modal-item"><input type="radio" name="preset" value="${e.identifier}" class="dashboard-modal-item-checkbox" id="dashboard-form-add-preset-${e.identifier}" ?checked="${0===t}"> <label for="dashboard-form-add-preset-${e.identifier}" class="dashboard-modal-item-block"><span class="dashboard-modal-item-icon"><typo3-backend-icon identifier="${e.icon}" size="medium"></typo3-backend-icon></span><span class="dashboard-modal-item-details"><span class="dashboard-modal-item-title">${e.title}</span> <span class="dashboard-modal-item-description">${e.description}</span></span></label></div>`))}</div></form>`;Modal.advanced({type:Modal.types.default,title:lll("dashboard.add"),size:Modal.sizes.medium,severity:SeverityEnum.notice,content:t,callback:e=>{e.addEventListener("typo3-modal-shown",(()=>{e.querySelector("#dashboard-form-add-title")?.focus()})),e.querySelector("form").addEventListener("submit",(t=>{t.preventDefault();const i=t.target,a=new FormData(i);this.dispatchEvent(new DashboardAddEvent(a.get("preset"),a.get("title"))),e.hideModal()}))},buttons:[{text:lll("dashboard.add.button.close"),btnClass:"btn-default",name:"cancel",trigger:(e,t)=>t.hideModal()},{text:lll("dashboard.add.button.ok"),btnClass:"btn-primary",name:"save",trigger:(e,t)=>t.querySelector("form").requestSubmit()}]})}editDashboard(e){const t=html`<form><div class="form-group"><label class="form-label" for="dashboard-form-edit-title">${lll("dashboard.title")}</label> <input class="form-control" id="dashboard-form-edit-title" type="text" name="title" value="${e.title||""}" required="required"></div></form>`;Modal.advanced({type:Modal.types.default,title:lll("dashboard.configure"),size:Modal.sizes.small,severity:SeverityEnum.notice,content:t,callback:t=>{t.addEventListener("typo3-modal-shown",(()=>{t.querySelector("#dashboard-form-edit-title")?.focus()})),t.querySelector("form").addEventListener("submit",(i=>{i.preventDefault();const a=i.target,s=new FormData(a);this.dispatchEvent(new DashboardEditEvent(e.identifier,s.get("title"))),t.hideModal()}))},buttons:[{text:lll("dashboard.configure.button.close"),btnClass:"btn-default",name:"cancel",trigger:(e,t)=>t.hideModal()},{text:lll("dashboard.configure.button.ok"),btnClass:"btn-primary",name:"save",trigger:(e,t)=>t.querySelector("form").requestSubmit()}]})}deleteDashboard(e){const t=Modal.confirm(lll("dashboard.delete"),lll("dashboard.delete.sure"),SeverityEnum.warning,[{text:lll("dashboard.delete.cancel"),active:!0,btnClass:"btn-default",name:"cancel"},{text:lll("dashboard.delete.ok"),btnClass:"btn-warning",name:"delete"}]);t.addEventListener("button.clicked",(i=>{"delete"===i.target.getAttribute("name")&&this.dispatchEvent(new DashboardDeleteEvent(e.identifier)),t.hideModal()}))}selectDashboard(e){null!==e&&ClientStorage.set(this.clientStorageIdentifier,e.identifier),this.currentDashboard=e}async addWidget(){topLevelModuleImport("@typo3/backend/new-record-wizard.js");const e=top.document.createElement("typo3-backend-new-record-wizard");e.searchPlaceholder=lll("widget.addToDashboard.searchLabel"),e.searchNothingFoundLabel=lll("widget.addToDashboard.searchNotFound"),e.categories=await this.fetchCategories(),e.addEventListener(newRecordWizardEventName,(async e=>{const{identifier:t}=e.detail.item,i=await new AjaxRequest(TYPO3.settings.ajaxUrls.dashboard_widget_add).post({dashboard:this.currentDashboard.identifier,type:t}),a=await i.resolve();if("ok"===a.status){this.currentDashboard.widgets.push(a.widget),this.requestUpdate(),await this.updateComplete;const e=this.getGridItemByIdentifier(a.widget.identifier);e&&(DomHelper.scrollIntoViewIfNeeded(e,!0),window.setTimeout((()=>e.querySelector(".widget-actions > button:first-child")?.focus({preventScroll:!0,focusVisible:!1})),50))}else Notification.error("",a.message)})),Modal.advanced({type:Modal.types.default,title:lll("widget.addToDashboard",this.currentDashboard.title),size:Modal.sizes.medium,severity:SeverityEnum.notice,content:e,callback:e=>{e.addEventListener("button.clicked",(()=>{e.hideModal()}))},buttons:[{text:lll("widget.add.button.close"),btnClass:"btn-default",name:"cancel"}]})}renderLoader(){return html`<div class="dashboard-loader"><typo3-backend-spinner size="medium"></typo3-backend-spinner></div>`}renderHeader(){const e=html`<button class="btn btn-primary btn-sm btn-dashboard-add-tab" title="${lll("dashboard.add")}" @click="${()=>{this.createDashboard()}}"><typo3-backend-icon identifier="actions-plus" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("dashboard.add")}</span></button>`,t=null!==this.currentDashboard?html`<button class="btn btn-default btn-sm" title="${lll("dashboard.configure")}" @click="${()=>{this.editDashboard(this.currentDashboard)}}"><typo3-backend-icon identifier="actions-cog" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("dashboard.configure")}</span></button>`:nothing,i=null!==this.currentDashboard?html`<button class="btn btn-default btn-sm" title="${lll("dashboard.delete")}" @click="${()=>{this.deleteDashboard(this.currentDashboard)}}"><typo3-backend-icon identifier="actions-delete" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("dashboard.delete")}</span></button>`:nothing;return html`<div class="dashboard-header"><h1 class="visually-hidden">${this.currentDashboard?.title}</h1><div class="dashboard-header-container"><div class="dashboard-tabs">${repeat(this.dashboards,(e=>e.identifier),(e=>html`<button @click="${()=>{this.selectDashboard(e)}}" class="dashboard-tab${e===this.currentDashboard?" dashboard-tab--active":""}">${e.title}</button>`))} ${e}</div>${t||i?html`<div class="dashboard-configuration btn-toolbar" role="toolbar">${t}${i}</div>`:nothing}</div></div>`}renderContent(){if(this.currentDashboard){if(this.currentDashboard.widgets.length>0){this.initializeCurrentDashboard();const e={keyframeOptions:{duration:250,fill:"both"},in:fadeIn,out:fadeOut,skipInitial:!0,disabled:this.prefersReducedMotion};return html`<div class="dashboard-grid" style="${styleMap({"--columns":this.columns})}">${repeat(this.currentDashboard.widgetPositions[this.columns],(e=>e.identifier),(t=>html`<div class="dashboard-item" style="${styleMap({"--col-start":t.x+1,"--col-span":t.width,"--row-start":t.y+1,"--row-span":t.height})}" data-widget-hash="${t.identifier}" data-widget-key="${this.widgetByIdentifier(t.identifier)?.type}" data-widget-identifier="${t.identifier}" draggable="true" @pointerenter="${e=>e.target.setAttribute("draggable","true")}" @widgetRefresh="${()=>this.handleLegacyWidgetRefreshEvent(t)}" ${animate(e)}><typo3-dashboard-widget .identifier="${t.identifier}"></typo3-dashboard-widget></div>`))}</div>`}return html`<div class="dashboard-empty"><div class="dashboard-empty-content"><h3>${lll("dashboard.empty.content.title")}</h3><p>${lll("dashboard.empty.content.description")}</p><button title="${lll("widget.add")}" class="btn btn-primary" @click="${()=>{this.addWidget()}}"><typo3-backend-icon identifier="actions-plus" size="small"></typo3-backend-icon>${lll("dashboard.empty.content.button")}</button></div></div>`}return nothing}renderFooter(){return null===this.currentDashboard?nothing:html`<div class="dashboard-add-item"><button class="btn btn-primary btn-dashboard-add-widget" title="${lll("widget.addToDashboard",this.currentDashboard.title)}" @click="${()=>{this.addWidget()}}"><typo3-backend-icon identifier="actions-plus" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("widget.addToDashboard",this.currentDashboard.title)}</span></button></div>`}getGridItemByIdentifier(e){return this.querySelector(selector`.dashboard-item[data-widget-identifier="${e}"]`)}handleDragStart(e){const t=e.target.closest(".dashboard-item");if(null===t)return void e.preventDefault();if(null===document.elementFromPoint(e.clientX,e.clientY).closest(".widget-header"))return void e.preventDefault();const i=t.dataset.widgetIdentifier,a=this.widgetPositionByIdentifier(i),s=t.getBoundingClientRect(),r=t.querySelector("typo3-dashboard-widget");r.style.pointerEvents="none",this.dragInformation={identifier:i,itemElement:t,widgetElement:r,height:a.height,width:a.width,offsetY:e.clientY-s.top,offsetX:e.clientX-s.left,currentY:a.y,currentX:a.x,initialPositions:this.currentDashboard.widgetPositions[this.columns].map((e=>({...e})))};const d=new Image;d.src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",e.dataTransfer.setDragImage(d,0,0),e.dataTransfer.setData("text/plain",""),e.dataTransfer.effectAllowed="move",t.classList.add("dashboard-item-dragging"),this.positionDraggingElement(e),this.draggingContainer.appendChild(r)}positionDraggingElement(e){const{itemElement:t,widgetElement:i}=this.dragInformation,a=t.getBoundingClientRect(),s=this.querySelector(".dashboard-container").getBoundingClientRect(),r=(d=e.clientX-this.dragInformation.offsetX,n=s.left-20,o=s.left+s.width-a.width+20,Math.min(o,Math.max(n,d)));var d,n,o;const l=Math.max(s.top-20,e.clientY-this.dragInformation.offsetY);i.style.left=`${r}px`,i.style.top=`${l}px`,i.style.width=`${a.width}px`,i.style.height=`${a.height}px`}handleDragEnd(){if(this.dragInformation){const{itemElement:e,widgetElement:t}=this.dragInformation;e.classList.remove("dashboard-item-dragging"),e.appendChild(t),t.removeAttribute("style"),this.dragInformation=null,this.widgetPositionsSort(this.currentDashboard.widgetPositions[this.columns]),this.dispatchEvent(new DashboardUpdateEvent(this.currentDashboard.identifier,this.currentDashboard.widgets,this.currentDashboard.widgetPositions))}}handleDragOver(e){if(this.dragInformation){e.preventDefault(),e.dataTransfer.dropEffect="move",this.positionDraggingElement(e);const t=this.querySelector(".dashboard-grid"),i=t.getBoundingClientRect(),a=parseInt(getComputedStyle(t).gap,10),s=parseInt(getComputedStyle(t).gridAutoRows,10)+a,r=(i.width+a)/this.columns,d=Math.max(0,e.clientY-i.top-this.dragInformation.offsetY),n=Math.max(0,e.clientX-i.left-this.dragInformation.offsetX),o=Math.max(0,Math.round(d/s)),l=Math.max(0,Math.min(Math.round(n/r),this.columns-this.dragInformation.width));this.dragInformation.currentY===o&&this.dragInformation.currentX===l||(this.dragInformation.currentY=o,this.dragInformation.currentX=l,this.dragOverTimeout&&clearTimeout(this.dragOverTimeout),this.dragOverTimeout=window.setTimeout((()=>{if(this.dragInformation){const e=this.widgetPositionByIdentifier(this.dragInformation.identifier);e.y=this.dragInformation.currentY,e.x=this.dragInformation.currentX,this.widgetPositionChange(this.currentDashboard.widgetPositions[this.columns],e)}}),100))}}handleLegacyWidgetRefreshEvent(e){this.dispatchEvent(new DashboardWidgetRefreshEvent(e.identifier))}initializeCurrentDashboard(){this.currentDashboard.widgetPositions=this.currentDashboard.widgetPositions??{};let e=this.currentDashboard.widgetPositions?.[this.columns]??[];const t={small:1,medium:2,large:4},i={small:1,medium:2,large:3};this.currentDashboard.widgets.forEach((a=>{if(void 0===e.find((e=>e.identifier===a.identifier))){const s=i[a.height]??1,r=t[a.width]??1,d={identifier:a.identifier,height:s,width:r<this.columns?r:this.columns,y:0,x:0};e.push(d)}})),e=this.widgetPositionsArrange(e),this.widgetPositionsCollapseRows(e),this.currentDashboard.widgetPositions[this.columns]=e}widgetByIdentifier(e){return this.currentDashboard.widgets.find((t=>t.identifier===e))??null}widgetPositionByIdentifier(e){return this.currentDashboard.widgetPositions[this.columns].find((t=>t.identifier===e))??null}widgetPositionCanPlace(e,t,i,a){return!(t<0||t>this.columns-e.width||i<0)&&a.isDisjointFrom(createSet({...e,x:t,y:i}))}widgetPositionChange(e,t){let i=structuredClone(this.dragInformation?.initialPositions??e);const a=i.findIndex((e=>e.identifier===t.identifier));let s;if(a>-1){const[e]=i.splice(a,1);s={...e},e.y=t.y,e.x=t.x,i.unshift(e)}i=this.widgetPositionsArrange(i,this.dragInformation?.initialPositions??e,s),e.forEach((e=>{const t=i.find((t=>t.identifier===e.identifier));e.y=t.y,e.x=t.x})),this.widgetPositionsCollapseRows(e),this.requestUpdate()}widgetTryPlacementInNeighbourCells(e,t,i){const a=this.columns;for(let i=e.x;i>=Math.max(0,e.x-e.width);i--)if(this.widgetPositionCanPlace(e,i,e.y,t))return{...e,x:i};for(let i=e.y;i>=0;i--)if(this.widgetPositionCanPlace(e,e.x,i,t))return{...e,y:i};for(let i=e.x;i<=Math.min(a,e.x+e.width);i++)if(this.widgetPositionCanPlace(e,i,e.y,t))return{...e,x:i};for(let a=e.y;a<=e.y+(i?.height??3);a++)if(this.widgetPositionCanPlace(e,e.x,a,t))return{...e,y:a};return null}widgetPositionsArrange(e,t,i){let a=new Set;const s=e=>this.widgetPositionCanPlace(e,e.x,e.y,a)?{...e}:null,r=e=>void 0===t?null:this.widgetTryPlacementInNeighbourCells(e,t.reduce(((e,t)=>e.union(createSet(t))),new Set).difference(createSet(i)).union(a),i),d=e=>this.widgetTryPlacementInNeighbourCells(e,a),n=e=>{const t=Math.max(0,e.y),i=Math.max(0,Math.min(this.columns-e.width,e.x)),s=Math.max(0,i),r=this.columns;for(let i=e.y;i<t+100;i++)for(let t=s;t<r;t++)if(this.widgetPositionCanPlace(e,t,i,a))return{...e,x:t,y:i};throw new Error("Logic error: could not occupy cells")};return e.map((e=>{return t=s(e)??r(e)??d(e)??n(e),a=a.union(createSet(t)),t;var t}))}widgetPositionsCollapseRows(e){const t=new Set;e.forEach((e=>{for(let i=0;i<e.height;i++)t.add(e.y+i)}));const i={};let a=0;for(let e=0;e<=Math.max(...t);e++)t.has(e)&&(i[e]=a++);e.forEach((e=>{e.y=i[e.y]}))}widgetPositionsSort(e){e.sort(((e,t)=>e.y!==t.y?e.y-t.y:e.x-t.x))}};__decorate([state()],Dashboard.prototype,"loading",void 0),__decorate([state()],Dashboard.prototype,"dashboards",void 0),__decorate([state()],Dashboard.prototype,"currentDashboard",void 0),__decorate([state()],Dashboard.prototype,"columns",void 0),__decorate([state()],Dashboard.prototype,"dragInformation",void 0),__decorate([query(".dashboard-dragging-container")],Dashboard.prototype,"draggingContainer",void 0),Dashboard=__decorate([customElement("typo3-dashboard")],Dashboard);export{Dashboard};let DashboardWidget=class extends LitElement{constructor(){super(...arguments),this.moving=!1,this.triggerContentRenderedEvent=!1,this.fetchTask=new Task(this,{args:()=>[this.identifier],task:async([e],{signal:t})=>{const i=TYPO3.settings.ajaxUrls.dashboard_widget_get,a=await new AjaxRequest(i).withQueryArguments({widget:e}).get({signal:t}),s=await a.resolve();if("ok"!==s.status)throw new Error(s.message);return s.widget},onComplete:async()=>{this.triggerContentRenderedEvent=!0},onError:e=>{console.error(`Error while retrieving widget [${this.identifier}]: ${e instanceof AjaxResponse?`${e.response.status} ${e.response.statusText}`:e.message}`)}})}get widget(){return this.fetchTask.value??null}refresh(){this.handleRefresh()}createRenderRoot(){return this}updated(){if(this.triggerContentRenderedEvent){this.triggerContentRenderedEvent=!1;const{widget:e}=this;this.dispatchEvent(new DashboardWidgetContentRenderedEvent(e)),this.dispatchEvent(new CustomEvent("widgetContentRendered",{bubbles:!0,detail:this.widget.eventdata}))}}render(){const e=html`<div class="widget-loader"><typo3-backend-spinner size="medium"></typo3-backend-spinner></div>`,t=(e=!1)=>html`<button type="button" title="${lll("widget.refresh")}" class="widget-action widget-action-refresh" @click="${this.handleRefresh}">${e?html`<typo3-backend-spinner size="small"></typo3-backend-spinner>`:html`<typo3-backend-icon identifier="actions-refresh" size="small"></typo3-backend-icon>`} <span class="visually-hidden">${lll("widget.refresh")}</span></button>`,i=(e,i=!1)=>html`<div class="widget-header"><div class="widget-title">${(e=>e?.label||"ERROR")(e)}</div><div class="widget-actions">${e?.options?.refreshAvailable?t(i):nothing} <button type="button" title="${lll("widget.move")}" class="widget-action widget-action-move" @click="${this.handleMoveClick}" @focusout="${this.handleMoveFocusOut}" @keydown="${this.handleMoveKeyDown}"><typo3-backend-icon identifier="${this.moving?"actions-thumbtack":"actions-move"}" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("widget.move")}</span></button> <button type="button" title="${lll("widget.remove")}" class="widget-action widget-action-remove" @click="${this.handleRemove}"><typo3-backend-icon identifier="actions-delete" size="small"></typo3-backend-icon><span class="visually-hidden">${lll("widget.remove")}</span></button></div></div><div class="widget-content" @pointerenter="${e=>e.target.closest(".dashboard-item").removeAttribute("draggable")}" @pointerleave="${e=>e.target.closest(".dashboard-item").setAttribute("draggable","true")}">${(e=>e?unsafeHTML(e.content):html`<div class="widget-content-main">${lll("widget.error")}</div>`)(e)}</div>`,a=this.fetchTask.render({initial:()=>nothing,error:()=>i(null),pending:()=>this.fetchTask.value?i(this.fetchTask.value,!0):delay(80,(()=>e)),complete:e=>i(e)});return html`<div class="widget ${this.moving?" widget-selected":""}">${a}</div>`}moveStart(){!1===this.moving&&(this.moving=!0,this.dispatchEvent(new DashboardWidgetMoveIntendEvent(this.widget.identifier,DashboardWidgetMoveIntend.start)))}moveEnd(){!0===this.moving&&(this.moving=!1,this.dispatchEvent(new DashboardWidgetMoveIntendEvent(this.widget.identifier,DashboardWidgetMoveIntend.end)))}handleMoveClick(){this.moving?this.moveEnd():this.moveStart()}handleMoveFocusOut(){this.moveEnd()}handleMoveKeyDown(e){if(!this.moving)return;if(!["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","Home","End","Enter","Space","Escape","Tab"].includes(e.code)||e.altKey||e.ctrlKey)return;e.preventDefault(),e.stopPropagation();let t=DashboardWidgetMoveIntend.end;switch(e.code){case"Escape":case"Enter":case"Space":return void this.moveEnd();case"ArrowUp":t=DashboardWidgetMoveIntend.up;break;case"ArrowDown":t=DashboardWidgetMoveIntend.down;break;case"ArrowLeft":t=DashboardWidgetMoveIntend.left;break;case"ArrowRight":t=DashboardWidgetMoveIntend.right;break;default:return}this.dispatchEvent(new DashboardWidgetMoveIntendEvent(this.widget.identifier,t))}handleRefresh(){this.fetchTask.run()}handleRemove(e){const t=Modal.confirm(lll("widget.remove.confirm.title"),lll("widget.remove.confirm.message"),SeverityEnum.warning,[{text:lll("widget.remove.button.close"),active:!0,btnClass:"btn-default",name:"cancel"},{text:lll("widget.remove.button.ok"),btnClass:"btn-warning",name:"delete"}]);t.addEventListener("button.clicked",(e=>{"delete"===e.target.getAttribute("name")&&this.dispatchEvent(new DashboardWidgetRemoveEvent(this.identifier)),t.hideModal()}));const i=e.currentTarget;t.addEventListener("typo3-modal-hide",(()=>{i?.focus()}))}};__decorate([property({type:String,reflect:!0})],DashboardWidget.prototype,"identifier",void 0),__decorate([state()],DashboardWidget.prototype,"moving",void 0),DashboardWidget=__decorate([customElement("typo3-dashboard-widget")],DashboardWidget);export{DashboardWidget};