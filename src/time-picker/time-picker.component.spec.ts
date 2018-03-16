import { Component, ViewChild } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IgxTimePickerComponent, IgxTimePickerModule } from "./time-picker.component";

describe("IgxTimePicker", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTimePickerTestComponent,
                IgxTimePickerWithPassedTimeComponent,
                IgxTimePickerWithPmTimeComponent
            ],
            imports: [IgxTimePickerModule, FormsModule, BrowserAnimationsModule]
        })
        .compileComponents();
    }));

    it("Initialize a timepicker component", () => {
        const fixture = TestBed.createComponent(IgxTimePickerTestComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const result = "";

        expect(fixture.componentInstance).toBeDefined();
        expect(timePicker.displayTime).toEqual(result);
    });

    it("@Input properties", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPassedTimeComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        expect(timePicker.value).toEqual(new Date(2017, 7, 7, 3, 24));
    });

    it("TimePicker DOM input value", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPassedTimeComponent);
        fixture.detectChanges();

        const currentTime = new Date(2017, 7, 7, 3, 24);
        const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()} ${currentTime.getHours() > 12 ? "PM" : "AM"}`;

        const dom = fixture.debugElement;

        const getValueFromInput = dom.query(By.css(".igx-form-group__input")).nativeElement.value;
        expect(getValueFromInput).toEqual(formattedTime);
    });

    it("Dialog header value", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPmTimeComponent);
        fixture.detectChanges();

        // get time-picker value
        const testElementTIme = fixture.componentInstance.dateValue;
        const formatedTestElementTime =
         `${testElementTIme.getHours()}:${testElementTIme.getMinutes()} ${testElementTIme.getHours() >= 12 ? "PM" : "AM"}`;

        const dom = fixture.debugElement;
        const timePickerTarget = dom.query(By.css(".igx-form-group__input"));

        timePickerTarget.triggerEventHandler("click", { target: dom.nativeElement.children[0] });
        fixture.detectChanges();

        // get time from dialog header
        const getTimeFromPopupHeader: any = dom.query(By.css(".igx-time-picker__header")).nativeElement.children;
        const formatedTimeFromPopupHeader =
         `${getTimeFromPopupHeader[1].innerText.replace(/\n/g, "")} ${getTimeFromPopupHeader[0].innerText}`;

        expect(formatedTimeFromPopupHeader).toBe(formatedTestElementTime);
    });

    it("Dialog selected element position", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPmTimeComponent);
        fixture.detectChanges();

        const dom = fixture.debugElement;
        const timePickerTarget = dom.query(By.css(".igx-form-group__input"));

        timePickerTarget.triggerEventHandler("click", { target: dom.nativeElement.children[0] });
        fixture.detectChanges();

        const expectedColumnElements = 7;
        const getHourColumn: any = dom.query(By.css(".igx-time-picker__hourList")).nativeElement.children;
        const getMinuteColumn: any = dom.query(By.css(".igx-time-picker__minuteList")).nativeElement.children;
        const getAMPMColumn: any = dom.query(By.css(".igx-time-picker__ampmList")).nativeElement.children;

        // check element count
        expect(getHourColumn.length).toBe(expectedColumnElements);
        expect(getMinuteColumn.length).toBe(expectedColumnElements);
        expect(getAMPMColumn.length).toBe(expectedColumnElements);

        // verify selected's position
        expect(getHourColumn[3].classList).toContain("igx-time-picker__item--selected");
        expect(getMinuteColumn[3].classList).toContain("igx-time-picker__item--selected");
        expect(getAMPMColumn[3].classList).toContain("igx-time-picker__item--selected");

    });

    it("TImepicker open event", () => {
        const fixture = TestBed.createComponent(IgxTimePickerTestComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const dom = fixture.debugElement;

        const target = dom.query(By.css(".igx-form-group__input"));

        spyOn(timePicker.onOpen, "emit");

        target.triggerEventHandler("click", { target: dom.nativeElement.children[0] });

        fixture.detectChanges();

        expect(timePicker.onOpen.emit).toHaveBeenCalled();
    });

    it("TImepicker open event", () => {
        const fixture = TestBed.createComponent(IgxTimePickerTestComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const dom = fixture.debugElement;

        const target = dom.query(By.css(".igx-form-group__input"));

        spyOn(timePicker.onOpen, "emit");

        target.triggerEventHandler("click", { target: dom.nativeElement.children[0] });

        fixture.detectChanges();

        expect(timePicker.onOpen.emit).toHaveBeenCalled();
    });

    it("Timepicker cancel button", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPmTimeComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const dom = fixture.debugElement;

        const initialTime = dom.query(By.css(".igx-form-group__input")).nativeElement.value;

        const target = dom.query(By.css(".igx-form-group__input"));
        target.triggerEventHandler("click", { target: dom.nativeElement.children[0] });
        fixture.detectChanges();

        const getHourColumn = dom.query(By.css(".igx-time-picker__hourList"));
        const selectHour = getHourColumn.children[5];

        const getMinutesColumn = dom.query(By.css(".igx-time-picker__minuteList"));
        const selectMinutes = getMinutesColumn.children[2];

        const getAMPMColumn = dom.query(By.css(".igx-time-picker__ampmList"));
        const selectAMPM = getAMPMColumn.children[4];

        selectHour.triggerEventHandler("click", {});
        fixture.detectChanges();
        selectMinutes.triggerEventHandler("click", {});
        fixture.detectChanges();
        selectAMPM.triggerEventHandler("click", {});
        fixture.detectChanges();

        const getCancelButton = dom.queryAll(By.css(".igx-button--flat"))[0];
        getCancelButton.triggerEventHandler("click", {});
        fixture.detectChanges();

        const selectedTime = dom.query(By.css(".igx-form-group__input")).nativeElement.value;
        expect(initialTime).toEqual(selectedTime);

    });

    it("Timepicker ValueChanged event", () => {
        const fixture = TestBed.createComponent(IgxTimePickerTestComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const dom = fixture.debugElement;

        const target = dom.query(By.css(".igx-form-group__input"));
        target.triggerEventHandler("click", { target: dom.nativeElement.children[0] });
        fixture.detectChanges();

        const getHourColumn = dom.query(By.css(".igx-time-picker__hourList"));
        const selectHour = getHourColumn.children[5];
        const hourValue = selectHour.nativeElement.innerText;

        const getMinutesColumn = dom.query(By.css(".igx-time-picker__minuteList"));
        const selectMinutes = getMinutesColumn.children[2];
        const minuteValue = selectMinutes.nativeElement.innerText;

        const getAMPMColumn = dom.query(By.css(".igx-time-picker__ampmList"));
        const selectAMPM = getAMPMColumn.children[4];
        const aMPMValue = selectAMPM.nativeElement.innerText;

        selectHour.triggerEventHandler("click", {});
        fixture.detectChanges();
        selectMinutes.triggerEventHandler("click", {});
        fixture.detectChanges();
        selectAMPM.triggerEventHandler("click", {});
        fixture.detectChanges();

        const getOkButton = dom.queryAll(By.css(".igx-button--flat"))[1];
        spyOn(timePicker.onValueChanged, "emit");
        getOkButton.triggerEventHandler("click", {});
        fixture.detectChanges();

        expect(timePicker.onValueChanged.emit).toHaveBeenCalled();

        const getValueFromInput = dom.query(By.css(".igx-form-group__input")).nativeElement.value;
        const selectedTime = `${hourValue}:${minuteValue} ${aMPMValue}`;

        expect(getValueFromInput).toEqual(selectedTime);

    });

    it("Timepicker Keyboard navigation", () => {
        const fixture = TestBed.createComponent(IgxTimePickerWithPassedTimeComponent);
        fixture.detectChanges();

        const timePicker = fixture.componentInstance.timePicker;
        const dom = fixture.debugElement;

        const input = dom.query(By.css(".igx-form-group__input"));
        input.triggerEventHandler("click", { target: dom.nativeElement.children[0] });
        fixture.detectChanges();

        const getHourColumn: any = dom.query(By.css(".igx-time-picker__hourList"));
        const getMinuteColumn: any = dom.query(By.css(".igx-time-picker__minuteList"));
        const getAMPMColumn: any = dom.query(By.css(".igx-time-picker__ampmList"));
        const dialog: any = dom.query(By.css(".igx-dialog__window"));

        getHourColumn.nativeElement.focus();
        // move arrows several times with hour column
        let args = { key: "ArrowUp", bubbles: true };
        getHourColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        args = { key: "ArrowDown", bubbles: true };
        getHourColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        args = { key: "ArrowUp", bubbles: true };
        getHourColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        fixture.detectChanges();

        getMinuteColumn.nativeElement.focus();
        // move arrows several times with minute column
        args = { key: "ArrowDown", bubbles: true };
        getMinuteColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        args = { key: "ArrowUp", bubbles: true };
        getMinuteColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        args = { key: "ArrowDown", bubbles: true };
        getMinuteColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        fixture.detectChanges();

        getAMPMColumn.nativeElement.focus();
        // move arrows several times with minute column
        args = { key: "ArrowUp", bubbles: true };
        getAMPMColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        args = { key: "ArrowDown", bubbles: true };
        getAMPMColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        fixture.detectChanges();

        // get time from dialog header
        const getTimeFromPopupHeader: any = dom.query(By.css(".igx-time-picker__header")).nativeElement.children;
        const formatedTimeFromPopupHeader =
         `${getTimeFromPopupHeader[1].innerText.replace(/\n/g, "")} ${getTimeFromPopupHeader[0].innerText}`;

        args = { key: "Enter", bubbles: true };
        getHourColumn.nativeElement.dispatchEvent(new KeyboardEvent("keydown", args));
        fixture.detectChanges();

        const getValueFromInput = dom.query(By.css(".igx-form-group__input")).nativeElement.value;

        expect(formatedTimeFromPopupHeader).toBe(getValueFromInput);
    });

});

@Component({
    template: `
        <igx-time-picker></igx-time-picker>
    `
})
export class IgxTimePickerTestComponent {
    @ViewChild(IgxTimePickerComponent) public timePicker: IgxTimePickerComponent;
}

@Component({
    template: `
        <igx-time-picker [value]="dateValue" [format]="customFormat"></igx-time-picker>
    `
})
export class IgxTimePickerWithPassedTimeComponent {
    public dateValue: Date = new Date(2017, 7, 7, 3, 24);
    public customFormat = "h:mm tt";
    @ViewChild(IgxTimePickerComponent) public timePicker: IgxTimePickerComponent;
}

@Component({
    template: `
        <igx-time-picker [value]="dateValue" [format]="customFormat"></igx-time-picker>
    `
})
export class IgxTimePickerWithPmTimeComponent {
    public dateValue: Date = new Date(2017, 7, 7, 12, 27);
    public customFormat = "h:mm tt";
    @ViewChild(IgxTimePickerComponent) public timePicker: IgxTimePickerComponent;
}