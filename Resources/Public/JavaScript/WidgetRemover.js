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
import Modal from"TYPO3/CMS/Backend/Modal.js";import{SeverityEnum}from"TYPO3/CMS/Backend/Enum/Severity.js";import RegularEvent from"TYPO3/CMS/Core/Event/RegularEvent.js";class WidgetRemover{constructor(){this.selector=".js-dashboard-remove-widget",this.initialize()}initialize(){new RegularEvent("click",(function(e){e.preventDefault();Modal.confirm(this.dataset.modalTitle,this.dataset.modalQuestion,SeverityEnum.warning,[{text:this.dataset.modalCancel,active:!0,btnClass:"btn-default",name:"cancel"},{text:this.dataset.modalOk,btnClass:"btn-warning",name:"delete"}]).on("button.clicked",e=>{"delete"===e.target.getAttribute("name")&&(window.location.href=this.getAttribute("href")),Modal.dismiss()})})).delegateTo(document,this.selector)}}export default new WidgetRemover;