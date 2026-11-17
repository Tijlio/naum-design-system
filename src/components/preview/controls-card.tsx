"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export function ControlsCard() {
  const [sliderValue, setSliderValue] = React.useState<number[]>([64])
  const [otp, setOtp] = React.useState("20101")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selection &amp; Controls</CardTitle>
        <CardDescription>
          RadioGroup, Slider, Progress and InputOTP
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          aria-label="Data source"
          defaultValue="primary"
          className="grid gap-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="primary" id="src-primary" />
            <Label htmlFor="src-primary">Primary data source</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="secondary" id="src-secondary" />
            <Label htmlFor="src-secondary">Secondary verification</Label>
          </div>
        </RadioGroup>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-xs">
            <span id="threshold-label" className="text-muted-foreground">
              Threshold
            </span>
            <span className="tabular-nums">{sliderValue[0]}%</span>
          </div>
          <Slider
            aria-labelledby="threshold-label"
            value={sliderValue}
            onValueChange={(val) =>
              setSliderValue(Array.isArray(val) ? [...val] : [val])
            }
            max={100}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completeness</span>
            <span className="tabular-nums">78%</span>
          </div>
          <Progress aria-label="Completeness" value={78} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="verification-code">Verification code</Label>
          <InputOTP
            id="verification-code"
            maxLength={5}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
    </Card>
  )
}
