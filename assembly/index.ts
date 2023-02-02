// The entry file of your WebAssembly module.

class SmartBuffer {
  private _offset: i32 = 0;
  constructor(private readonly _bytes: Uint8Array) { }

  get offset(): i32 {
    return this._offset;
  }

  static ofSize(size: i32): SmartBuffer {
    return new SmartBuffer(new Uint8Array(size));
  }

  writeUint8(val: i32): void {
    this._bytes[this._offset++] = val & 0xff;
  }

  writeUint16(val: i32): void {
    this._bytes[this._offset++] = (val >> 8) & 0xff;
    this._bytes[this._offset++] = val & 0xff;
  }

  writeUint32(val: i32): void {
    this._bytes[this._offset++] = (val >> 24) & 0xff;
    this._bytes[this._offset++] = (val >> 16) & 0xff;
    this._bytes[this._offset++] = (val >> 8) & 0xff;
    this._bytes[this._offset++] = val & 0xff;
  }

  writeBytes(val: Uint8Array): void {
    this._bytes.set(val, this._offset);
    this._offset += val.length;
  }

  writeBuffer(val: SmartBuffer): void {
    this._bytes.set(val.bytes, this._offset);
    this._offset += val.bytes.length;
  }

  writeBytes8Length(val: Uint8Array): void {
    this.writeUint8(val.length);
    this.writeBytes(val);
  }

  writeBuffer8Length(val: SmartBuffer): void {
    this.writeUint8(val.bytes.length);
    this.writeBuffer(val);
  }

  writeBytes16Length(val: Uint8Array): void {
    this.writeUint16(val.length);
    this.writeBytes(val);
  }

  writeBuffer16Length(val: SmartBuffer): void {
    this.writeUint16(val.bytes.length);
    this.writeBuffer(val);
  }

  writeBytes32Length(val: Uint8Array): void {
    this.writeUint32(val.length);
    this.writeBytes(val);
  }

  writeBuffer32Length(val: SmartBuffer): void {
    this.writeUint32(val.bytes.length);
    this.writeBuffer(val);
  }

  readUint8(): i32 {
    return this._bytes[this._offset++] & 0xff;
  }

  readUint16(): i32 {
    return ((this._bytes[this._offset++] & 0xff) << 8) + (this._bytes[this._offset++] & 0xff);
  }

  readUint32(): i32 {
    return (
      ((this._bytes[this._offset++] & 0xff) << 24) +
      ((this._bytes[this._offset++] & 0xff) << 16) +
      ((this._bytes[this._offset++] & 0xff) << 8) +
      (this._bytes[this._offset++] & 0xff)
    );
  }

  readBytes(length: i32): Uint8Array {
    return this._bytes.slice(this._offset, (this._offset += length));
  }

  readBuffer(length: i32): SmartBuffer {
    return new SmartBuffer(this._bytes.slice(this._offset, (this._offset += length)));
  }

  readBytes8Length(): Uint8Array {
    return this.readBytes(this.readUint8());
  }

  readBuffer8Length(): SmartBuffer {
    return this.readBuffer(this.readUint8());
  }

  readBytes16Length(): Uint8Array {
    return this.readBytes(this.readUint16());
  }

  readBuffer16Length(): SmartBuffer {
    return this.readBuffer(this.readUint16());
  }

  readBytes32Length(): Uint8Array {
    return this.readBytes(this.readUint32());
  }

  readBuffer32Length(): SmartBuffer {
    return this.readBuffer(this.readUint32());
  }

  get bytes(): Uint8Array {
    return this._bytes;
  }

}

const VERSION = 0x01;
export function MessageContentV1Pack(
  subjectBytes: Uint8Array,
  signature: Uint8Array,
  attacheds: Uint8Array,
  previousMessageAddress: Uint8Array,
  bodyBytes: Uint8Array,
): Uint8Array {

  const buf = SmartBuffer.ofSize(1 + 2 + subjectBytes.length + 2 + signature.length + 2 + attacheds.length + 2 + previousMessageAddress.length + bodyBytes.length);

  buf.writeUint8(VERSION);
  buf.writeBytes16Length(subjectBytes);
  buf.writeBytes16Length(signature);
  buf.writeBytes16Length(attacheds);
  buf.writeBytes16Length(previousMessageAddress);
  buf.writeBytes(bodyBytes);

  return buf.bytes
}

export function MessageContentV1Unpack(
  data: Uint8Array
): Uint8Array[] {
  const buf = new SmartBuffer(data);
  const version = buf.readUint8();

  if (version !== VERSION) {
    return [new Uint8Array(0)]
  }

  const subjectBytes = buf.readBytes16Length();
  const signature = buf.readBytes16Length();
  const attacheds = buf.readBytes16Length();
  const previousMessageAddress = buf.readBytes16Length();
  const bodyBytes = data.slice(version + 2 + subjectBytes.length + 2 + signature.length + 2 + attacheds.length + 2 + previousMessageAddress.length);

  return [subjectBytes, signature, attacheds, previousMessageAddress, bodyBytes]
}