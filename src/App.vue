<script setup>
import { reactive, computed } from "vue";

// --- ส่วนที่ 1: State สำหรับ Position Calculator ---
const inputs = reactive({
  portfolioBalance: 10000,
  riskPercent: 2,
  stopLossPercent: 3,
  leverage: 10,
});

// --- ส่วนที่ 2: State สำหรับ Scenario Simulator ---
const simulatorInputs = reactive({
  tpPercent: 6,
  slPercent: 3,
  totalTrades: 20,
  winTrades: 10,
});

// --- ส่วนที่ 1: ผลลัพธ์สำหรับ Position Calculator ---
const results = computed(() => {
  if (
    inputs.riskPercent <= 0 ||
    inputs.stopLossPercent <= 0 ||
    inputs.leverage <= 0
  ) {
    return { positionSize: 0, tradesLeft: 0, riskAmount: 0 };
  }

  const riskAmount = inputs.portfolioBalance * (inputs.riskPercent / 100);
  const notionalValue = riskAmount / (inputs.stopLossPercent / 100);
  const positionSize = notionalValue / inputs.leverage;
  const totalTrades = Math.floor(100 / inputs.riskPercent);
  const tradesLeft = totalTrades - 1;

  return {
    positionSize: positionSize,
    tradesLeft: tradesLeft,
    riskAmount: riskAmount,
  };
});

// --- ส่วนที่ 2: ผลลัพธ์สำหรับ Scenario Simulator ---
const simulatorResults = computed(() => {
  const amountLostPerTrade = results.value.riskAmount;
  const rrr =
    simulatorInputs.slPercent > 0
      ? simulatorInputs.tpPercent / simulatorInputs.slPercent
      : 0;
  const amountGainedPerTrade = amountLostPerTrade * rrr;
  const loseTrades = simulatorInputs.totalTrades - simulatorInputs.winTrades;
  const winRate =
    simulatorInputs.totalTrades > 0
      ? (simulatorInputs.winTrades / simulatorInputs.totalTrades) * 100
      : 0;
  const totalProfit = simulatorInputs.winTrades * amountGainedPerTrade;
  const totalLoss = loseTrades * amountLostPerTrade;
  const netProfit = totalProfit - totalLoss;
  const profitPercentOfPortfolio =
    inputs.portfolioBalance > 0
      ? (netProfit / inputs.portfolioBalance) * 100
      : 0;

  return {
    rrr,
    loseTrades,
    winRate,
    totalProfit,
    totalLoss,
    netProfit,
    profitPercentOfPortfolio,
    amountGainedPerTrade,
    amountLostPerTrade,
  };
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-4 sm:p-8 font-sans">
    <div class="max-w-md mx-auto space-y-8">
      <div class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 class="text-xl sm:text-2xl font-bold mb-1">
          Position Size Calculator
        </h1>
        <p class="text-gray-400 mb-6 text-sm sm:text-base">
          คำนวณ Position Size ก่อนเข้าเทรด
        </p>

        <div class="space-y-4">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >MY PORTFOLIO BALANCE *</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="inputs.portfolioBalance"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >USDT</span
              >
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >% RISK OF RUIN *</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="inputs.riskPercent"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >%</span
              >
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >% STOP LOSS *</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="inputs.stopLossPercent"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >%</span
              >
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >LEVERAGE *</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="inputs.leverage"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >X</span
              >
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-6" />

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-base sm:text-lg font-medium text-gray-300"
              >POSITION SIZE</span
            >
            <span class="text-2xl sm:text-3xl font-bold text-green-400">
              {{ results.positionSize.toFixed(2) }}
              <span class="text-base sm:text-lg text-gray-400 ml-1">USDT</span>
            </span>
          </div>
          <div class="bg-gray-700 p-4 rounded-md text-sm text-gray-300">
            <ul class="list-disc list-inside space-y-2">
              <li>
                Position Size ของคุณคือ
                <strong>{{ results.positionSize.toFixed(2) }} USDT</strong>
              </li>
              <li>
                คุณจะขาดทุน
                <strong>{{ results.riskAmount.toFixed(2) }} USDT</strong> หากโดน
                Stop Loss
              </li>
              <li>
                หากแพ้ครั้งนี้ คุณจะเหลือโอกาสอีก
                <strong>{{ results.tradesLeft }} ครั้ง</strong>
                (ถ้าเสี่ยงเท่าเดิม)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 class="text-xl sm:text-2xl font-bold mb-1">Scenario Simulator</h1>
        <p class="text-gray-400 mb-6 text-sm sm:text-base">
          จำลองสถานการณ์ Win/Loss
        </p>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1">TP %</label>
            <div class="relative">
              <input
                type="number"
                v-model.number="simulatorInputs.tpPercent"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >%</span
              >
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1">SL %</label>
            <div class="relative">
              <input
                type="number"
                v-model.number="simulatorInputs.slPercent"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-3 text-gray-400 text-sm"
                >%</span
              >
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >เล่นทั้งหมด (ครั้ง)</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="simulatorInputs.totalTrades"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-300 mb-1"
              >ชนะ (ครั้ง)</label
            >
            <div class="relative">
              <input
                type="number"
                v-model.number="simulatorInputs.winTrades"
                class="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <hr class="border-gray-600 my-6" />

        <div class="space-y-3">
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300">Position Size ที่ใช้</span>
            <span class="font-bold text-white"
              >{{ results.positionSize.toFixed(2) }} USDT</span
            >
          </div>

          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300">Risk:Reward Ratio (RRR)</span>
            <span class="font-bold text-white"
              >1 : {{ simulatorResults.rrr.toFixed(1) }}</span
            >
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300">Win Rate</span>
            <span class="font-bold text-white"
              >{{ simulatorResults.winRate.toFixed(0) }} %</span
            >
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300"
              >กำไรทั้งหมด ({{ simulatorInputs.winTrades }} ครั้ง)</span
            >
            <span class="font-bold text-green-400"
              >+ {{ simulatorResults.totalProfit.toFixed(2) }} USDT</span
            >
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300"
              >ขาดทุนทั้งหมด ({{ simulatorResults.loseTrades }} ครั้ง)</span
            >
            <span class="font-bold text-red-400"
              >- {{ simulatorResults.totalLoss.toFixed(2) }} USDT</span
            >
          </div>

          <hr class="border-gray-600 !my-4" />

          <div class="flex justify-between items-center text-lg">
            <span class="text-gray-300">กำไรสุทธิ</span>
            <span
              class="font-bold"
              :class="
                simulatorResults.netProfit >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              "
            >
              {{ simulatorResults.netProfit.toFixed(2) }} USDT
            </span>
          </div>
          <div class="flex justify-between items-center text-base">
            <span class="text-gray-300">คิดเป็น</span>
            <span
              class="font-bold"
              :class="
                simulatorResults.profitPercentOfPortfolio >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              "
            >
              {{ simulatorResults.profitPercentOfPortfolio.toFixed(2) }} %
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
