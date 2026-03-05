class Test {

  /**
   * Adds two numbers
   * @param a - The first number
   * @param b - The second number
   * @returns The sum of the two numbers
   * @throws Error if b is greater than a
   * @example
   * const test = new Test();
   * test.addTwoNumbers(1, 2); // 3
   * test.addTwoNumbers(2, 1); // throws Error
   */
  public addTwoNumbers(a: number, b: number): number {
    if (b > a) { // partitally covered
      throw new Error("b is greater than a"); // not covered
    }
    return a + b; // completely
  }

}

// VITEST

class TestTest {

  @Test
  public testAddTwoNumbers() {
    const test = new Test();
    const result = test.addTwoNumbers(1, 2); // 3
    expect(result).toBe(3);
  }

  // @Test
  // public testAddTwoNumbersError() {
  //   const test = new Test();
  //   expect(() => test.addTwoNumbers(2, 1)).toThrowError("b is greater than a");
  // }
}