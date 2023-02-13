import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-confirmation-prompt',
    templateUrl: './confirmation-prompt.component.html',
    styleUrls: ['./confirmation-prompt.component.scss']
})
export class ConfirmationPromptComponent implements OnInit {
    @Input() message: string;
    @Input() confirmPrompt: string;
    @Input() denyPrompt: string;

    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();
    @Output() deny = new EventEmitter<void>();

    ngOnInit() {
        console.log('This is a confirmation prompt, not an app-alert');
    }

    onClose() { this.close.emit(); }
    onConfirm() { this.confirm.emit(); }
    onDeny() { this.deny.emit(); }
}
